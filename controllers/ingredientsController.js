
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import listIngredients from '../services/ingredientsServices.js';

const getAllIngredients = async (req, res) => { 
  const result = await listIngredients();
  res.json(result);
};

export default ctrlWrapper(getAllIngredients);
