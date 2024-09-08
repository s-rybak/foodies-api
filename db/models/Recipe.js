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
    allowNull: false,
    references: {
      model: Category,
      key: 'id'
    }
  },
  areaId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Area,
      key: 'id'
    }
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true // Sequelize автоматически добавляет createdAt и updatedAt
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
User.hasMany(Recipe, {
  foreignKey: 'ownerId',
});

Recipe.belongsToMany(Ingredient, { through: 'recipe_ingredients' });

Ingredient.belongsToMany(Recipe, { through: 'recipe_ingredients' });

Category.hasMany(Recipe, {
  foreignKey: 'categoryId'
});

export default Recipe;
