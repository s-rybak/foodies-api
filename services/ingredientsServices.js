import Ingredient from '../db/models/Ingredient.js';

const listIngredients = (query = {}) => {
  return Ingredient.findAll({ where: query });
};

export default listIngredients;
