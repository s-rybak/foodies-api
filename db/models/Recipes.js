import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import Ingredient from "./Ingredient.js";
import RecipeIngredient from "./RecipeIngredient.js";

const Recipe = sequelize.define('Recipe', {
	id: {
		type: DataTypes.INTEGER,  // Используем INTEGER для id
		autoIncrement: true,  // Автоматическое увеличение значения
		primaryKey: true,
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	category: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	area: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	instructions: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	thumb: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	time: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	//todo: Add owner field
	// owner: {
	// 	type: DataTypes.UUID,
	// 	allowNull: false,
	// }
}, {
	timestamps: true,
});


//todo: Define the relationship between Recipe and Ingredients
Recipe.belongsToMany(Ingredient, { through: RecipeIngredient, as: 'ingredients', foreignKey: 'recipeId' });
// Recipe.belongsToMany(User, {
// 	through: FavoriteRecipe,
// 	foreignKey: 'recipeId',
// 	as: 'usersWhoFavorited' // псевдоним для отношения
// });

export default Recipe;
