import {DataTypes} from "sequelize";
import sequelize from "../sequelize.js";
import User from "./User.js";
import Recipe from "./Recipe.js";


const UserFavorite = sequelize.define('user_favorite', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	ownerId: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
	},
	recipeId: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
	}
}, {
	timestamps: false
});

UserFavorite.belongsTo(User, {
	foreignKey: 'ownerId',
	as: 'owner'
});

UserFavorite.belongsTo(Recipe, {
	foreignKey: 'recipeId',
	as: 'recipe'
});

export default UserFavorite;
