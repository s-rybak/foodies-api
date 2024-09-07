import ctrlWrapper from "../decorators/ctrlWrapper.js";
import listCategories from "../services/categoriesServices.js";

const getAllcategories = async (req, res) => {
  const result = await listCategories();
  res.json(result);
};

export default ctrlWrapper(getAllcategories);
