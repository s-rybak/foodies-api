import {Router} from "express";
import {
    getById,
    createRecipe,
    addToFavorites,
    removeFromFavorites,
    deleteRecipe, getUserRecipes, getUserFavoriteRecipes, getAllRecipes, getPopularRecipesController,
} from "../controllers/recipesController.js";
import validateBody from "../decorators/validateBody.js";
import {
    createRecipeSchema,
    queryRecipes,
    routerUserFavoriteRecipeSchema,
    routerUserRecipeSchema
} from "../schemas/recipeSchema.js";
import authMiddleware from "../middlewares/authenticateMiddleware.js"
import validateQuery from "../decorators/validateQuery.js";


const recipesRouter = Router();

recipesRouter.post('/', authMiddleware, validateBody(createRecipeSchema), createRecipe);
recipesRouter.delete('/:id/favorites', authMiddleware, removeFromFavorites);
recipesRouter.get('/favorites', authMiddleware, validateQuery(routerUserFavoriteRecipeSchema), getUserFavoriteRecipes);
recipesRouter.delete('/:id', authMiddleware, deleteRecipe);
recipesRouter.get('/my-recipes', authMiddleware, validateQuery(routerUserRecipeSchema), getUserRecipes);
recipesRouter.get("/popular", getPopularRecipesController);
recipesRouter.get('/:id', getById);
recipesRouter.post('/:id/favorites', authMiddleware, addToFavorites);
recipesRouter.get("/", validateQuery(queryRecipes), getAllRecipes);



export default recipesRouter;




