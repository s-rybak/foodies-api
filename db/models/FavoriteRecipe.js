import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import Recipe from "./Recipes.js";
import User from "./User.js";


const FavoriteRecipe = sequelize.define('FavoriteRecipe', {
	userId: {
		type: DataTypes.UUID,
		references: {
			model: User,
			key: 'id'
		},
		allowNull: false
	},
	recipeId: {
		type: DataTypes.INTEGER,
		references: {
			model: Recipe,
			key: 'id'
		},
		allowNull: false
	}
}, {
	timestamps: false
});

export default FavoriteRecipe;
