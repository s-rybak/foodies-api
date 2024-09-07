import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import Recipe from "./Recipe.js";

const Favorite = sequelize.define("favorite", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Favorite.sync({ force: true });

export default Favorite;
