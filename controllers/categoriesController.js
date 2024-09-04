import listCategories from '../services/categoriesServices.js';
import HttpError from '../helpers/HttpError.js';

const getAllcategories = async (req, res) => {
  try {
    const result = await listCategories();
    res.json(result);
  } catch (error) {
    next(HttpError(500, 'Failed to fetch categories'));
  }
};

export default getAllcategories;
