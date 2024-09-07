import {DataTypes} from "sequelize";
import sequelize from "../sequelize.js";
import Category from "./Category.js";
import Ingredient from "./Ingredient.js";
import User from "./User.js";
import Area from "./Area.js";

const Recipe = sequelize.define("recipe", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  thumb: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  areaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

Recipe.belongsTo(Area, {
  foreignKey: 'areaId'
});

Recipe.belongsTo(User, {
  foreignKey: 'ownerId'
});

Recipe.belongsTo(Category, {
  foreignKey: 'categoryId'
});

Recipe.belongsToMany(Ingredient, { through: 'recipe_ingredient' });

Ingredient.belongsToMany(Recipe, { through: 'recipe_ingredient' });

Category.hasMany(Recipe, {
  foreignKey: 'id'
});


export default Recipe;
