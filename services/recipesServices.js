import Recipe from "../db/models/Recipe.js";
import Favorite from "../db/models/Favorite.js";

export const getRecipeById = async (id) => {
  const recipe = await Recipe.findByPk(id); 
  if (!recipe) {
    throw new Error(`Recipe with id ${id} not found`);
  }
  return recipe;
};

export const getPopularRecipes = async () => {
  try {
    const recipes = await Recipe.findAll({
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("Favorites.recipeId")),
            "favoritesCount"
          ]
        ]
      },
      include: [
        {
          model: Favorite,
          attributes: []
        }
      ],
      group: ["Recipe.id"],
      order: [[sequelize.literal("favoritesCount"), "DESC"]]
    });

    return recipes;
  } catch (error) {
    throw new Error("Failed to retrieve popular recipes: " + error.message);
  }
};

export const createRecipe = async (recipeData) => {
  try {

    const newRecipe = await Recipe.create(recipeData);

    return newRecipe;
  } catch (error) {

    throw new Error('Error creating recipe: ' + error.message);
  }
};

export const listRecipes = async () => {
  try {
    const recipes = await Recipe.findAll(); 
    return recipes;
  } catch (error) {
    throw new Error('Error retrieving recipes: ' + error.message);
  }
};