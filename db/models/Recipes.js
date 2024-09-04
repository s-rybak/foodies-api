import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Recipe = sequelize.define('Recipe', {
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

Recipe.sync();

//todo: Define the relationship between Recipe and Ingredients
// Recipe.belongsToMany(Ingredient, { through: RecipeIngredient, as: 'ingredients', foreignKey: 'recipeId' });

export default Recipe;
