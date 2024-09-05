import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const RecipeIngredient = sequelize.define('RecipeIngredient', {
	id: {
		type: DataTypes.UUID,  // UUID для промежуточной таблицы
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	recipeId: {
		type: DataTypes.UUID,
		references: {
			model: 'Recipes',
			key: 'id',
		},
		onDelete: 'CASCADE',
	},
	ingredientId: {
		type: DataTypes.UUID,
		references: {
			model: 'Ingredients',
			key: 'id',
		},
		onDelete: 'CASCADE',
	},
	measure: {
		type: DataTypes.STRING,
		allowNull: false,
	}
}, {
	timestamps: false,
});

//todo: sync the model


export default RecipeIngredient;
