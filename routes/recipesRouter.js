
import { Router } from "express";
import {
  getAllRecipes,
  addRecipe,
  getOneRecipe,
  getPopularRecipesController
} from "../controllers/recipesController.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import validateBody from "../helpers/validateBody.js";
import { createRecipeSchema } from "../schemas/addRecipeSchema.js";
import {createRecipeSchema} from "../schemas/recipeSchema.js";

const createRecipeMiddleware = validateBody(createRecipeSchema);

const recipesRouter = Router();

recipesRouter.post("/recipes", validateBody(createRecipeSchema), ctrlWrapper(addRecipe));
recipesRouter.get("/popular", ctrlWrapper(getPopularRecipesController));
recipesRouter.get("/", ctrlWrapper(getAllRecipes));
recipesRouter.get("/:id", ctrlWrapper(getOneRecipe));
//todo: add authenticate middleware

recipesRouter.post('/', createRecipeMiddleware, recipesController.createRecipe);
recipesRouter.delete('/:id', recipesController.deleteRecipe);
recipesRouter.get('/', recipesController.getAllRecipes);
recipesRouter.post('/favorites',  recipesController.addRecipeToFavorites);
recipesRouter.delete('/favorites/:recipeId',  recipesController.removeRecipeFromFavorites);
recipesRouter.get('/favorites',  recipesController.getFavoriteRecipes);


export default recipesRouter;
