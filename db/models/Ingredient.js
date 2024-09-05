import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Ingredient = sequelize.define(
	'Ingredients',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,  // Используем UUID
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		desc: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		img: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);



export default Ingredient;
