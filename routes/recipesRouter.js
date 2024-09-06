
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


const recipesRouter = Router();

recipesRouter.post("/recipes", validateBody(createRecipeSchema), ctrlWrapper(addRecipe));
recipesRouter.get("/", ctrlWrapper(getAllRecipes));
recipesRouter.get("/:id", ctrlWrapper(getOneRecipe));
recipesRouter.get("/popular", ctrlWrapper(getPopularRecipesController));

export default recipesRouter;




