import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from "../decorators/ctrlWrapper.js";

import {
	listRecipes,
	getRecipeById,
	createRecipes,
	addRecipeToFavorites,
	removeRecipeFromFavorites,
	removeRecipe,
	getFavoriteRecipesByUserId,
} from "../services/recipesServices.js";
import Recipe from "../db/models/Recipe.js";
import UserFavorite from "../db/models/UserFavorite.js";


export const getById = ctrlWrapper(async (req, res, next) => {
	try {
		const { id } = req.params;

		if (!id) {
			throw HttpError(404, `Recipe with id=${id} not found`);
		}

		const recipe = await getRecipeById(id);

		if (!recipe) {
			throw HttpError(404, `Recipe with id=${id} not found`);
		}

		res.json(recipe);
	} catch (e) {
		next(e);
	}
});

export const createRecipe = ctrlWrapper(async (req, res) => {
	const user = req.user;
	const newRecipe = await createRecipes({ ...req.body, ownerId: user.id });

	if (!newRecipe) {
		throw HttpError(500);
	}
	res.status(201).json(newRecipe);
});

export const getUserRecipes = ctrlWrapper(async (req, res, next) => {
	const { id: currentUserId } = req.user;
	//const { limit, offset } = req.pagination;
	const result = await listRecipes({ ownerId: currentUserId, limit:10, offset:0 });

	res.json(result);
});

export const deleteRecipe = ctrlWrapper(async (req, res, next) => {
	const { id } = req.params;
	if (!id) {
		return next(HttpError(404));
	}

	const result = await removeRecipe(id);
	if (!result) {
		return next(HttpError(404));
	}
	res.status(200).json({ message: 'Recipe deleted successfully' });
});

export const getUserFavoriteRecipes = async (req, res, next) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const userId = req.user.id;
		const favoriteRecipes = await getFavoriteRecipesByUserId(userId, { page, limit });

		if (!favoriteRecipes || favoriteRecipes.length === 0) {
			return res.status(404).json({ message: 'No favorite recipes found' });
		}

		res.status(200).json(favoriteRecipes);
	} catch (error) {
		next(error);
	}
};

export const addToFavorites = async (req, res, next) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		const recipeFound = await Recipe.findByPk(id);
		if (!recipeFound) {
			return next(HttpError(404, 'Recipe not found'));
		}

		const alreadyFavorite = await UserFavorite.findOne({
			where: { ownerId: userId, id }
		});

		if (alreadyFavorite) {
			return next(HttpError(409, 'Recipe already in favorites'));
		}

		const favorite = await addRecipeToFavorites(userId, id);
		res.status(201).json(favorite);
	} catch (error) {
		next(error);
	}
};

export const removeFromFavorites = async (req, res, next) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		const recipeFound = await UserFavorite.findOne({
			where: { ownerId: userId, id }
		});

		if (!recipeFound) {
			return next(HttpError(404, 'Recipe not found'));
		}
		await removeRecipeFromFavorites(userId, id);
		res.status(204);
	} catch (e) {
		next(e);
	}
};
