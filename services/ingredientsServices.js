import Ingredient from '../db/models/Ingredient.js';

const listIngredients = (query = {},  pagination = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;
  return Ingredient.findAll({ where: query, offset, limit: normalizedLimit });
};

export default listIngredients;
