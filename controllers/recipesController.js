import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import {
	createRecipeSchema,
} from '../schemas/addRecipeSchema.js';
import {
	createRecipe,
	listRecipes,
	getRecipeById,
	getPopularRecipes
} from "../services/recipesServices.js";

// Create new recipe
export const addRecipe = async (req, res) => {
	try {

		const { error } = createRecipeSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ details: error.details });
		}

		const newRecipe = await createRecipe(req.body);

		res.status(201).json(newRecipe);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: error.message,
		});
	}
};

export const getAllRecipes = async (req, res, next) => {
	try {
		console.log("in controller");

		const { category, ingredient, region, page = 1, limit = 10 } = req.query || {};

		const pageInt = parseInt(page);
		const limitInt = parseInt(limit);

		if (isNaN(pageInt) || isNaN(limitInt) || pageInt <= 0 || limitInt <= 0) {
			return next(HttpError(400, "Invalid pagination parameters."));
		}

		const { count, rows } = await listRecipes({ category, ingredient, region, page: pageInt, limit: limitInt });

		if (count === 0) {
			return res.status(404).json({ message: "No recipes found." });
		}

		res.status(200).json({ total: count, recipes: rows });
	} catch (error) {
		if (error.name === "SequelizeDatabaseError") {
			return next(HttpError(500, "Database error occurred."));
		}
		next(error);
	}
};

export const getPopularRecipesController = async (req, res, next) => {
	try {
		const recipes = await getPopularRecipes();

		if (!recipes || recipes.length === 0) {
			return res.status(404).json({ message: "No popular recipes found." });
		}

		res.status(200).json(recipes);
	} catch (error) {
		next(HttpError(500, error.message));
	}
};

export const getOneRecipe = async (req, res, next) => {
	try {
		const { id } = req.params;
		const recipe = await getRecipeById(id);
		if (!recipe) {
			throw HttpError(404, `Recipe with id=${id} not found`);
		}
		res.status(200).json(recipe);
	} catch (error) {
		next(error);
	}
};

// Delete a recipe
export const deleteRecipeController = ctrlWrapper(async (req, res, next) => {
	const recipe = await deleteRecipe(req.params.id, req.user.id);
	if (!recipe) {
		return res.status(404).json({ error: 'Recipe not found or not owned by the user' });
	}
	res.status(204).end();
});

// Add recipe to favorites
export const addRecipeToFavoritesController = ctrlWrapper(async (req, res) => {
	const userId = req.user.id;
	const { recipeId } = req.body;
	const result = await addRecipeToFavorites(userId, recipeId);
	res.status(result.status).json({ message: result.message });
});

// Remove recipe from favorites
export const removeRecipeFromFavoritesController = ctrlWrapper(async (req, res) => {
	const userId = req.user.id;
	const { recipeId } = req.params;
	const result = await removeRecipeFromFavorites(userId, recipeId);
	res.status(result.status).json({ message: result.message });
});

// Get user's favorite recipes
export const getFavoriteRecipesController = ctrlWrapper(async (req, res) => {
	const userId = req.user.id;
	const favoriteRecipes = await getFavoriteRecipes(userId);
	res.status(200).json(favoriteRecipes);
});
