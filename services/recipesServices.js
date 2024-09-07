import Recipe from "../db/models/Recipe.js";
import Category from "../db/models/Category.js";
import Area from "../db/models/Area.js";
import Ingredient from "../db/models/Ingredient.js";
import User from "../db/models/User.js";
import sequelize from "../db/sequelize.js";
import UserFavorite from "../db/models/UserFavorite.js";
import RecipeIngredient from "../db/models/RecipeIngredient.js";

export const listRecipes = async ({ ownerId, limit, offset }) => {
  return Recipe.findAll({
    where: { ownerId },
    include: [
      { model: Ingredient, through: { attributes: [] } },
      { model: Category },
      { model: Area },
      { model: User, attributes: ['id', 'name', 'avatar'] }
    ],
    limit,
    offset
  });
};

export const getRecipeById = async (id) => {
  return Recipe.findOne({
    where: { id },
    include: [
      { model: Ingredient, through: { attributes: [] } },
      { model: Category },
      { model: Area },
      { model: User, attributes: ['id', 'name', 'avatar'] }
    ]
  });
};

export const createRecipes = async ({ ingredients, ...recipeBody }) => {
  const transaction = await sequelize.transaction();
  try {
    const recipe = await Recipe.create(recipeBody, { transaction });

    const ingredientsStored = await Ingredient.findAll({
      where: { id: ingredients }
    });

    await Promise.all(
      ingredientsStored.map(ingredient => recipe.addIngredient(ingredient, { transaction }))
    );

    await transaction.commit();
    return getRecipeById(recipe.id);
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};

export const getFavoriteRecipesByUserId = async (userId) => {
  return UserFavorite.findAll({
    where: { ownerId: userId },
    include: [
      {
        model: Recipe,
        as: 'recipe',
        include: [
          { model: Ingredient, through: { attributes: [] } },
          { model: Category },
          { model: Area }
        ]
      }
    ]
  });
};

export const addRecipeToFavorites = async (userId, recipeId) => {
  return UserFavorite.create({
    ownerId: userId,
    recipeId
  });
};

export const removeRecipeFromFavorites = async (userId, recipeId) => {
  return await UserFavorite.destroy({
    where: { ownerId: userId, recipeId }
  });
};

export const removeRecipe = async (id) => {
  await RecipeIngredient.destroy({
    where: { recipeId: id }
  });
  await UserFavorite.destroy({
    where: { recipeId: id }
  });
  return await Recipe.destroy({
    where: { id }
  });
};

