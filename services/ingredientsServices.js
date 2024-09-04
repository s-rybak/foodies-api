import Ingredient from "../db/models/Ingredient.js";

const listIngredients = () => {
  console.log("we are in services")
  return Ingredient.findAll();
};

export default listIngredients;
