import ctrlWrapper from '../helpers/ctrlWrapper.js';
import listIngredients from '../services/ingredientsServices.js';

const getAllIngredients = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await listIngredients({}, { page, limit });
  res.json(result);
};

export default ctrlWrapper(getAllIngredients);
