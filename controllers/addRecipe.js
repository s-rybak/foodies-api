import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { createRecipeSchema } from '../schemas/addSchema.js';
import { createRecipe } from "../services/recipesServices.js";


export const addRecipe = async (req, res) => {
  try {

    const { error } = createRecipeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Invalid data', details: error.details });
    }

    const currentDate = new Date().toISOString();
    const recipeData = {
      ...req.body,
      createdAt: currentDate,  
      updatedAt: currentDate, 
    };

    const newRecipe = await createRecipe(recipeData);

    res.status(201).json({
      message: 'Recipe created successfully',
      data: newRecipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating recipe',
      error: error.message,
    });
  }
};

export default ctrlWrapper(addRecipe); 