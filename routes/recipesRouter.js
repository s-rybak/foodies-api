import { Router } from "express";
import {
  getById,
  createRecipe,
  addToFavorites,
  removeFromFavorites,
  deleteRecipe,
  getUserRecipes,
  getUserFavoriteRecipes,
  getAllRecipes,
  getPopularRecipesController,
} from "../controllers/recipesController.js";
import validateBody from "../decorators/validateBody.js";
import {
  createRecipeSchema,
  queryRecipes,
  routerUserFavoriteRecipeSchema,
  routerUserRecipeSchema,
} from "../schemas/recipeSchema.js";
import authMiddleware from "../middlewares/authenticateMiddleware.js";
import validateQuery from "../decorators/validateQuery.js";
import { uploadRecipeThumpMiddleware } from "../middlewares/uploadImageMiddleware.js";
import multerErrorHandlingMiddleware from "../middlewares/multerErrorHandlingMiddleware.js";
import fileUploadValidationMiddleware from "../middlewares/fileUploadValidationMiddleware.js";

const recipesRouter = Router();

recipesRouter.post(
  "/",
  authMiddleware,
  uploadRecipeThumpMiddleware.single("thumb"),
  multerErrorHandlingMiddleware,
  fileUploadValidationMiddleware,
  validateBody(createRecipeSchema),
  createRecipe
);
recipesRouter.delete("/:id/favorites", authMiddleware, removeFromFavorites);
recipesRouter.get(
  "/favorites",
  authMiddleware,
  validateQuery(routerUserFavoriteRecipeSchema),
  getUserFavoriteRecipes
);
recipesRouter.delete("/:id", authMiddleware, deleteRecipe);
recipesRouter.get(
  "/my-recipes",
  authMiddleware,
  validateQuery(routerUserRecipeSchema),
  getUserRecipes
);
recipesRouter.get("/popular", getPopularRecipesController);
recipesRouter.get("/:id", getById);
recipesRouter.post("/:id/favorites", authMiddleware, addToFavorites);
recipesRouter.get("/", validateQuery(queryRecipes), getAllRecipes);

export default recipesRouter;
