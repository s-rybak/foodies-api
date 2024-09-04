import {DataTypes} from "sequelize";
import sequelize from "../sequelize.js";

const Recipe = sequelize.define("recipe", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // автоматичне збільшення ID
  },
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
    allowNull: true,
  },
  thumb: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
});
  
  Recipe.sync({ force: true }); 

export default Recipe;


