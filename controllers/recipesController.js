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

		if (!recipe) {
			return res.status(404).json({ error: 'Recipe not found or not owned by the user' });
		}

		res.status(204).end();
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const addRecipeToFavorites = async (req, res) => {
	const userId = req.user.id; // Предполагаем, что ID пользователя берется из токена
	const { recipeId } = req.body;

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

	try {
		const result = await r.removeRecipeFromFavorites(userId, recipeId);
		res.status(result.status).json({ message: result.message });
	} catch (error) {
		res.status(500).json({ error: 'Failed to remove recipe from favorites' });
	}
};

const getFavoriteRecipes = async (req, res) => {
	const userId = req.user.id;

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
