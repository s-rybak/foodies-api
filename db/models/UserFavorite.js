import {DataTypes} from "sequelize";
import sequelize from "../sequelize.js";

const UserFavorite = sequelize.define('user_favorite', {
	ownerId: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
	},
	recipeId: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
	},
}, {
	timestamps: true,
	createdAt: true,
	updatedAt: false,
});

export default UserFavorite;