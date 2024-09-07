import {DataTypes} from "sequelize";
import sequelize from "../sequelize.js";
import {emailRegex} from "../../constants/constants.js";
import FavoriteRecipe from "./FavoriteRecipe.js";
import Recipe from "./Recipe.js";


const User = sequelize.define("users", {
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: emailRegex,
        },
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    avatarURL: {
        type: DataTypes.STRING,
    },
    verify: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verificationToken: {
        type: DataTypes.STRING,
    },
});

User.belongsToMany(Recipe, {
    through: FavoriteRecipe,
    foreignKey: 'userId',
    as: 'favoriteRecipes' // псевдоним для отношения
});

export default User;
