import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import listIngredients from '../services/ingredientsServices.js';

const getAllIngredients = async (req, res) => {
  try {
    const result = await listIngredients();

    res.json(result);
  } catch (error) {
    next(HttpError(500));
  }
};

export default ctrlWrapper(getAllIngredients);
