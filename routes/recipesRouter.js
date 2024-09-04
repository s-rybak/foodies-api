
import {Router} from "express";
import  getAllRecipes  from "../controllers/getAllRecipes.js";
// import  getRecipeById  from "../controllers/getRecipeById.js";
// import  getPopularRecipesController  from "../controllers/getPopularRecipes.js";
import  addRecipe from "../controllers/addRecipe.js";

import validateQuery from "../helpers/validateQuery.js";

const recipesRouter = Router();

recipesRouter.post("/recipes", addRecipe);

recipesRouter.get("/",getAllRecipes );

// recipesRouter.get("/:id", validateQuery, getRecipeById);

// recipesRouter.get("/popular", getPopularRecipesController); 



export default recipesRouter;




