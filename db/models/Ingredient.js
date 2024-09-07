import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import Recipe from "./Recipe.js";

const Ingredient = sequelize.define(
  'ingredient',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
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
