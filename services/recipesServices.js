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
      { model: User, attributes: ['id', 'name'] }
    ],
    limit,
    offset
  });
};

export const getRecipeById = async (id) => {
  return Recipe.findOne({
    where: { id },
    include: [
      { model: Ingredient, through: { attributes: ['measure'] },  attributes: ['id', 'name', 'desc', 'img']},
      { model: Category },
      { model: Area },
      { model: User, attributes: ['id', 'name'] }
    ]
  });
};

export const createRecipes = async ({ ingredients, ...recipeBody }) => {
  const transaction = await sequelize.transaction();
  try {
    const recipe = await Recipe.create(recipeBody, { transaction });

    if (!recipe || !recipe.id) {
      throw new Error('Recipe creation failed');
    }

    const ingredientIds = ingredients.map(ing => ing.id);
    const ingredientsStored = await Ingredient.findAll({
      where: { id: ingredientIds }
    });

    await transaction.commit();

    await Promise.all(
      ingredients.map(async ({ id, measure }) => {
        const ingredient = ingredientsStored.find(ing => ing.id === id);
        if (ingredient) {
          if (!measure) {
            throw new Error(`Measure is missing for ingredient ${id}`);
          }

          console.log(`Adding ingredient ${id} with measure ${measure}`);

          await RecipeIngredient.create({
            recipeId: recipe.id,
            ingredientId: ingredient.id,
            measure: measure
          });
        }
      })
    );

    // Возвращаем рецепт после вставки всех ингредиентов
    return getRecipeById(recipe.id);
  } catch (e) {
    // Откат транзакции при ошибке
    console.error('Error during recipe creation:', e);
    await transaction.rollback();
    throw e;
  }
};

export const getFavoriteRecipesByUserId = async (userId, pagination) => {
  const { page = 1, limit = 20 } = pagination;
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;

  return UserFavorite.findAll({
    where: { ownerId: userId },
    offset,
    limit: normalizedLimit,
    order: [["createdAt", "desc"]],
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

