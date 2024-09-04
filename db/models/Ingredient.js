import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Ingredient = sequelize.define(
  'Ingredients',
  {
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
// Ingredient.sync({ force: true });

export default Ingredient;
