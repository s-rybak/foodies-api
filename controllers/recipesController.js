
import HttpError from '../helpers/HttpError.js';
import { createRecipeSchema } from '../schemas/addRecipeSchema.js';
import {
  createRecipe,
  listRecipes,
  getRecipeById,
  getPopularRecipes,
 } from "../services/recipesServices.js";


 export const addRecipe = async (req, res) => {
  try {
import ctrlWrapper from "../helpers/ctrlWrapper.js";
//todo: implement Error Handler
// import HttpError from "../helpers/HttpError.js";
import * as r from "../services/recipesService.js";

const getAllRecipes = async (req, res) => {
	try {
		const recipes = await r.getAllRecipes();
		res.json(recipes);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const createRecipe = async (req, res) => {
	//todo: req.user.id
	//todo: const { title, category, area, instructions, description, thumb, time, ingredients } = req.body;
	// const recipe = await Recipe.create({
	// 	title,
	// 	category,
	// 	area,
	// 	instructions,
	// 	description,
	// 	thumb,
	// 	time,
	// 	owner: req.user.id
	// });

	try {
		const recipe = await r.createRecipe(req.body);

		//todo: Link ingredients with measures to the recipe
		// const ingredientPromises = ingredients.map(async (ingredient) => {
		// 	const ingredientExists = await i.findByPk(ingredient.id); // Find the ingredient in the database
		// 	if (ingredientExists) {
		// 		await ri.create({
		// 			recipeId: recipe.id,
		// 			ingredientId: ingredient.id,
		// 			measure: ingredient.measure,
		// 		});
		// 	}
		// });

		res.status(201).json(recipe);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const deleteRecipe = async (req, res) => {
	try {
		const recipe = await r.deleteRecipe(req.params.id);

    const { error } = createRecipeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ details: error.details });
    }
		if (!recipe) {
			return res.status(404).json({ error: 'Recipe not found or not owned by the user' });
		}

    const newRecipe = await createRecipe(req.body);

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
		res.status(204).end();
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const addRecipeToFavorites = async (req, res) => {
	const userId = req.user.id; // Предполагаем, что ID пользователя берется из токена
	const { recipeId } = req.body;

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
	try {
		const result = await r.addRecipeToFavorites(userId, recipeId);
		res.status(result.status).json({ message: result.message });
	} catch (error) {
		res.status(500).json({ error: 'Failed to add recipe to favorites' });
	}
};

const removeRecipeFromFavorites = async (req, res) => {
	const userId = req.user.id;
	const { recipeId } = req.params;

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
	try {
		const result = await r.removeRecipeFromFavorites(userId, recipeId);
		res.status(result.status).json({ message: result.message });
	} catch (error) {
		res.status(500).json({ error: 'Failed to remove recipe from favorites' });
	}
};

const getFavoriteRecipes = async (req, res) => {
	const userId = req.user.id;

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
	try {
		const favoriteRecipes = await r.getFavoriteRecipes(userId);
		res.status(200).json(favoriteRecipes);
	} catch (error) {
		res.status(500).json({ error: 'Failed to retrieve favorite recipes' });
	}
};


export default {
	getAllRecipes: ctrlWrapper(getAllRecipes),
	createRecipe: ctrlWrapper(createRecipe),
	deleteRecipe: ctrlWrapper(deleteRecipe),
	addRecipeToFavorites: ctrlWrapper(addRecipeToFavorites),
	removeRecipeFromFavorites: ctrlWrapper(removeRecipeFromFavorites),
	getFavoriteRecipes: ctrlWrapper(getFavoriteRecipes),
};
