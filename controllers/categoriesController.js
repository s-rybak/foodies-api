import listCategories from '../services/categoriesServices.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';

const getAllcategories = async (req, res) => {
  const result = await listCategories();
  res.json(result);
};

export default ctrlWrapper(getAllcategories);
