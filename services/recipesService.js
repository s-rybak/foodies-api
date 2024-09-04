import Recipe from '../db/models/Recipes.js';

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
