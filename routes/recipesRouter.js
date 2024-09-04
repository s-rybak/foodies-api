import { Router } from "express";
import recipesController from "../controllers/recipesController.js";
import validateBody from "../helpers/validateBody.js";
import {createRecipeSchema} from "../schemas/recipeSchema.js";

const createRecipeMiddleware = validateBody(createRecipeSchema);

const recipesRouter = Router();

//todo: add authenticate middleware

recipesRouter.post('/', createRecipeMiddleware, recipesController.createRecipe);
recipesRouter.delete('/:id', recipesController.deleteRecipe);
recipesRouter.get('/', recipesController.getAllRecipes);


export default recipesRouter;
