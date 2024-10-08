import {recipesFolderRelPath} from "../constants/constants.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

import {
    listRecipes,
    getRecipeById,
    createRecipes,
    addRecipeToFavorites,
    removeRecipeFromFavorites,
    removeRecipe,
    getFavoriteRecipesByUserId,
    getPopularRecipes,
    isRecipeFavorite,
} from "../services/recipesServices.js";
import Recipe from "../db/models/Recipe.js";
import UserFavorite from "../db/models/UserFavorite.js";
import claudinaryServices from "../services/coudinaryService.js";

export const getById = ctrlWrapper(async (req, res, next) => {
    try {
        const {id} = req.params;
        const {id: userId = null} = req.user ?? {};

        if (!id) {
            throw HttpError(404, `Recipe with id=${id} not found`);
        }

        const recipe = (await getRecipeById(id)).dataValues;

        if (!recipe) {
            throw HttpError(404, `Recipe with id=${id} not found`);
        }

        recipe.isFavirote = false;

        if (userId) {
            recipe.isFavirote = await isRecipeFavorite(userId, id);
        }

        console.log(recipe)

        res.json(recipe);
    } catch (e) {
        next(e);
    }
});

export const createRecipe = ctrlWrapper(async (req, res) => {
    const user = req.user;
    const thumbFile = req.file;

    // Move thumb image file from 'temp' to recipes folder and rename the file
    const thumbPathStr = await claudinaryServices.saveFileToServerFileSystem(
        thumbFile,
        recipesFolderRelPath,
        "thumb"
    );

    // Add recipe data in database
    const newRecipe = await createRecipes({
        ...req.body,
        thumb: thumbPathStr,
        ownerId: user.id,
    });
    if (!newRecipe) {
        throw HttpError(500);
    }

    // Reply with newly created recipe data
    res.status(201).json(newRecipe);
});

export const getUserRecipes = ctrlWrapper(async (req, res, next) => {
    const {id: currentUserId} = req.user;
    const {limit = 10, page = 1} = req.query;
    const offset = (page - 1) * limit;
    const {rows} = await listRecipes(
        {ownerId: currentUserId},
        {limit, offset}
    );

    res.json({
        total: rows.length,
        recipes: rows,
    });
});

export const deleteRecipe = ctrlWrapper(async (req, res, next) => {
    const {id} = req.params;
    if (!id) {
        return next(HttpError(404));
    }

    const result = await removeRecipe(id);
    if (!result) {
        return next(HttpError(404));
    }
    res.status(200).json({message: "Recipe deleted successfully"});
});

export const getUserFavoriteRecipes = async (req, res, next) => {
    try {
        const {page = 1, limit = 10} = req.query;

        const userId = req.user.id;
        const {
            total, rows
        } = await getFavoriteRecipesByUserId(userId, {
            page,
            limit,
        });

        if (!rows || total === 0) {
            return res.status(404).json({message: "No favorite recipes found"});
        }
        res.status(200).json({
            total,
            favoriteRecipes: rows,
        });
    } catch (error) {
        next(error);
    }
};

export const addToFavorites = async (req, res, next) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;

        const recipeFound = await Recipe.findByPk(id);
        if (!recipeFound) {
            return next(HttpError(404, "Recipe not found"));
        }

        const alreadyFavorite = await UserFavorite.findOne({
            where: {ownerId: userId, recipeId: id},
        });

        if (alreadyFavorite) {
            return next(HttpError(409, "Recipe already in favorites"));
        }

        const favorite = await addRecipeToFavorites(userId, id);
        res.status(201).json(favorite);
    } catch (error) {
        next(error);
    }
};

export const removeFromFavorites = async (req, res, next) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;

        const recipeFound = await UserFavorite.findOne({
            where: {ownerId: userId, recipeId: id},
        });

        if (!recipeFound) {
            return next(HttpError(404, "Recipe not found"));
        }
        await removeRecipeFromFavorites(userId, id);
        res.status(204).json();
    } catch (e) {
        next(e);
    }
};

export const getPopularRecipesController = ctrlWrapper(
    async (req, res, next) => {
        try {
            const {page = 1, limit = 10} = req.query;
            const recipes = await getPopularRecipes({page, limit});

            if (!recipes || recipes.length === 0) {
                return res.status(404).json({message: "No popular recipes found."});
            }

            const formattedRecipes = recipes.map(recipe => ({
                ...recipe.toJSON(),
                favoriteCount: parseInt(recipe.get("favoriteCount")),
            }));

            res.status(200).json(formattedRecipes);
        } catch (error) {
            next(HttpError(500, error.message));
        }
    }
);

export const getAllRecipes = ctrlWrapper(async (req, res, next) => {
    try {
        const {
            ownerId = null,
            category = null,
            ingredient = null,
            area = null,
            page = 1,
            limit = 10,
        } = req.query;

        const {count, rows} = await listRecipes(
            {category, ingredient, area, ownerId},
            {limit, offset: (page - 1) * limit}
        );

        if (count === 0) {
            return res.status(404).json({message: "No recipes found."});
        }

        res.status(200).json({total: count, recipes: rows});
    } catch (error) {
        if (error.name === "SequelizeDatabaseError") {
            return next(HttpError(500, "Database error occurred."));
        }
        next(error);
    }
});
