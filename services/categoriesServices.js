import Category from "../db/models/Category.js";

const listCategories = () => {
  return Category.findAll();
};

export default listCategories;
