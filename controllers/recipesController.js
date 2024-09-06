
import HttpError from '../helpers/HttpError.js';
import {
  createRecipe,
  listRecipes,
  getRecipeById,
  getPopularRecipes,
 } from "../services/recipesServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";


 export const addRecipe = ctrlWrapper(async (req, res) => {
   const newRecipe = await createRecipe({
     ...req.body,
     owner: req.user.id,
   });

   res.status(201).json(newRecipe);
 });

export const getAllRecipes = ctrlWrapper(async (req, res, next) => {
  try {
    console.log("in controller");
    //TODO add shcema validation in middleware
    const { category, ingredient, region, page = 1, limit = 10 } = req.query || {};

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    if (isNaN(pageInt) || isNaN(limitInt) || pageInt <= 0 || limitInt <= 0) {
      return next(HttpError(400, "Invalid pagination parameters."));
    }
    //TODO implement filter in service or remove this functionality
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
});

export const getPopularRecipesController = ctrlWrapper(async (req, res, next) => {
  try {
    const recipes = await getPopularRecipes();

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: "No popular recipes found." });
    }

    res.status(200).json(recipes);
  } catch (error) {
    next(HttpError(500, error.message));
  }
});

export const getOneRecipe = ctrlWrapper(async (req, res, next) => {
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
});