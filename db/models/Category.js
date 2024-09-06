import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Category = sequelize.define(
  'Categories',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
// Category.sync({ force: true });

export default Category;