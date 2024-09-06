import Recipe from '../db/models/Recipes.js';
import FavoriteRecipe from "../db/models/FavoriteRecipe.js";

export const getAllRecipes = async () => {
	try {
		const recipes = await Recipe.findAll();
		return recipes;
	} catch (error) {
		throw new Error('Error fetching recipes');
	}
};

//todo: add userId
export const createRecipe = async (data) => {
	try {
		const recipe = await Recipe.create(data);
		return recipe;
	} catch (error) {
		throw new Error('Error creating recipe');
	}
};


//todo: add userId
export const deleteRecipe = async (id, userId) => {
	try {
		const recipe = await Recipe.findOne({ where: { id } });
		if (!recipe) {
			return null;
		}
		await recipe.destroy();
		return recipe;
	} catch (error) {
		throw new Error('Error deleting recipe');
	}
};

export const addRecipeToFavorites = async (userId, recipeId) => {
	try {
		const [favorite, created] = await FavoriteRecipe.findOrCreate({
			where: { userId, recipeId }
		});

		if (!created) {
			return { status: 400, message: 'Recipe is already in favorites' };
		}

		return { status: 201, message: 'Recipe added to favorites' };
	} catch (error) {
		throw new Error('Failed to add recipe to favorites');
	}
};

export const removeRecipeFromFavorites = async(userId, recipeId) =>  {
	try {
		const result = await FavoriteRecipe.destroy({
			where: { userId, recipeId }
		});

		if (result === 0) {
			return { status: 404, message: 'Recipe not found in favorites' };
		}

		return { status: 200, message: 'Recipe removed from favorites' };
	} catch (error) {
		throw new Error('Failed to remove recipe from favorites');
	}
};

export const getFavoriteRecipes = async (userId) => {
	try {
		const favorites = await FavoriteRecipe.findAll({
			where: { userId },
			include: {
				model: Recipe,
				attributes: ['id', 'title', 'category', 'description', 'thumb', 'time']
			}
		});

		return favorites.map(fav => fav.Recipe);
	} catch (error) {
		throw new Error('Failed to retrieve favorite recipes');
	}
}
