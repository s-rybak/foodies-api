import { Router } from "express";

import {
  getAllRecipes,
  addRecipe,
  getOneRecipe,
  getPopularRecipesController,
} from "../controllers/recipesController.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import validateBody from "../decorators/validateBody.js";
import { createRecipeSchema } from "../schemas/addRecipeSchema.js";

const recipesRouter = Router();

recipesRouter.get("/", ctrlWrapper(getAllRecipes));
recipesRouter.get("/popular", ctrlWrapper(getPopularRecipesController));
recipesRouter.get("/:id", ctrlWrapper(getOneRecipe));

recipesRouter.post(
  "/",
  validateBody(createRecipeSchema),
  ctrlWrapper(addRecipe)
);

export default recipesRouter;
