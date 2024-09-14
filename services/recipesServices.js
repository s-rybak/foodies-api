import path from "node:path";

import { defaultPublicFolderName } from "../constants/constants.js";

import Recipe from "../db/models/Recipe.js";
import Category from "../db/models/Category.js";
import Area from "../db/models/Area.js";
import Ingredient from "../db/models/Ingredient.js";
import User from "../db/models/User.js";
import sequelize from "../db/sequelize.js";
import UserFavorite from "../db/models/UserFavorite.js";
import RecipeIngredient from "../db/models/RecipeIngredient.js";
import { removeFile } from "./fileServices.js";

/**
 *
 * @param ownerId
 * @param categoryIn {Array<string>|null|string} array of category ids
 * @param ingredientIn {Array<string>|null|string} array of ingredient ids
 * @param area {Array<string>|null|string} array of region ids
 * @param limit
 * @param offset
 * @returns {Promise<Recipe[]>}
 */
export const listRecipes = async (
  { ownerId = null, category = null, ingredient = null, area = null },
  { limit = 10, offset = 1 }
) => {
  const query = {};
  const includeOptions = [
    { model: Ingredient, as: "ingredients", through: { attributes: [] } },
    { model: Category },
    { model: Area },
    { model: User, attributes: ["id", "name", "avatar"] },
  ];

  if (ownerId) {
    query.ownerId = ownerId;
  }

  if (category) {
    query.categoryId = category;
  }

  if (area) {
    query.areaId = area;
  }

  if (ingredient) {
    includeOptions[0].where = { id: ingredient };
  }

  return {
    count: await Recipe.count({
      distinct: true,
      include: includeOptions,
      where: query,
    }),
    rows: await Recipe.findAll({
      where: query,
      include: includeOptions,
      limit,
      offset,
    }),
  };
};

export const getPopularRecipes = async ({ page = 1, limit = 20 }) => {
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;

  try {
    return await Recipe.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "thumb",
        "time",
        [
          sequelize.fn("COUNT", sequelize.col("userFavorites.ownerId")),
          "favorite_count",
        ],
      ],
      include: [
        {
          model: UserFavorite,
          as: "userFavorites",
          attributes: [],
          required: false,
        },
        { model: Category, attributes: ["id", "name"] },
        { model: Area, attributes: ["id", "name"] },
        { model: User, attributes: ["id", "name","avatar"] },
      ],
      group: ["recipe.id", "category.id", "area.id", "user.id"],
      order: [[sequelize.literal("favorite_count"), "DESC"]],
      limit: normalizedLimit,
      offset,
      subQuery: false,
    });
  } catch (error) {
    console.error("Error fetching popular recipes:", error);
    throw new Error("Error fetching popular recipes: " + error.message);
  }
};

export const getRecipeById = async id => {
  return Recipe.findOne({
    where: { id },
    include: [
      {
        model: Ingredient,
        through: { attributes: ["measure"] },
        attributes: ["id", "name", "desc", "img"],
      },
      { model: Category },
      { model: Area },
      { model: User, attributes: ["id", "name", "avatar"] },
    ],
  });
};

export const createRecipes = async ({ ingredients, ...recipeBody }) => {
  const transaction = await sequelize.transaction();
  try {
    const recipe = await Recipe.create(recipeBody, { transaction });

    if (!recipe || !recipe.id) {
      throw new Error("Recipe creation failed");
    }

    const ingredientIds = ingredients.map(ing => ing.id);
    const ingredientsStored = await Ingredient.findAll({
      where: { id: ingredientIds },
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
            measure: measure,
          });
        }
      })
    );

    // Возвращаем рецепт после вставки всех ингредиентов
    return getRecipeById(recipe.id);
  } catch (e) {
    // Откат транзакции при ошибке
    console.error("Error during recipe creation:", e);
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
        as: "recipe",
        include: [
          { model: Ingredient, through: { attributes: [] } },
          { model: Category },
          { model: Area },
        ],
      },
    ],
  });
};

export const addRecipeToFavorites = async (userId, recipeId) => {
  return UserFavorite.create({
    ownerId: userId,
    recipeId,
  });
};

export const removeRecipeFromFavorites = async (userId, recipeId) => {
  return await UserFavorite.destroy({
    where: { ownerId: userId, recipeId },
  });
};

export const removeRecipe = async id => {
  const { dataValues: recipe } = await getRecipeById(id);

  await RecipeIngredient.destroy({
    where: { recipeId: id },
  });
  await UserFavorite.destroy({
    where: { recipeId: id },
  });
  const result = await Recipe.destroy({
    where: { id },
  });

  if (result > 0 && recipe.thumb) {
    // Remove recipe thumb image file
    const thumbPath = path.resolve(defaultPublicFolderName, recipe.thumb);
    removeFile(thumbPath);
  }

  return result;
};
