import uploadFile from "../decorators/uploadFile.js";
import {
  imagesAllowedExtensions,
  avatarMaxFileSizeKB,
  recipeMaxFileSizeKB,
  ingredientMaxFileSizeKB,
} from "../constants/constants.js";

export const uploadAvatarImageMiddleware = uploadFile(
  imagesAllowedExtensions,
  avatarMaxFileSizeKB
);

export const uploadRecipeThumpMiddleware = uploadFile(
  imagesAllowedExtensions,
  recipeMaxFileSizeKB
);

export const uploadIngredientImageMiddleware = uploadFile(
  imagesAllowedExtensions,
  ingredientMaxFileSizeKB
);
