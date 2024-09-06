import {Router} from "express";
import {
    getAllRecipes,
    addRecipe,
    getOneRecipe,
    getPopularRecipesController
} from "../controllers/recipesController.js";
import validateBody from "../helpers/validateBody.js";
import {createRecipeSchema} from "../schemas/recipeSchemas.js";


const recipesRouter = Router();

//TODO add authenticateMiddleware on users merge
recipesRouter.post("/", validateBody(createRecipeSchema), addRecipe);
recipesRouter.get("/popular", getPopularRecipesController);
recipesRouter.get("/", getAllRecipes);
recipesRouter.get("/:id", getOneRecipe);

export default recipesRouter;




