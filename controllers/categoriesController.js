import listCategories from '../services/categoriesServices.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';

const getAllcategories = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await listCategories({ page, limit });
  res.json(result);
};

export default ctrlWrapper(getAllcategories);
