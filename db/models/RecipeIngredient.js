import {DataTypes} from "sequelize";
import sequelize from "../sequelize.js";
import Ingredient from "./Ingredient.js";
import Recipe from "./Recipe.js";

const RecipeIngredient = sequelize.define('recipe_ingredients', {
	recipeId: {
		type: DataTypes.UUID,
		references: {
			model: Recipe,
			key: 'id'
		},
		allowNull: false,
		primaryKey: true
	},
	ingredientId: {
		type: DataTypes.UUID,
		references: {
			model: Ingredient,
			key: 'id'
		},
		allowNull: false,
		primaryKey: true
	},
	measure: {
		type: DataTypes.STRING,
		allowNull: true
	}
});


export default RecipeIngredient;
