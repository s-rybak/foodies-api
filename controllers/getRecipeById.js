// import { getRecipesById } from "../services/recipesServices.js";
// import ctrlWrapper from "../helpers/ctrlWrapper.js";
// import HttpError from "../helpers/HttpError.js";

// const getRecipeById = async (req, res, next) => {
//   const { id } = req.params;

//   if (!isValidId(id)) {
//     return next(HttpError(400, "Invalid recipe ID"));
//   }
//   try {
//     const recipe = await getRecipesById(id); 
    
//     if (!recipe) {
//       return next(HttpError(404, `Recipe with id ${id} not found`));
//     }

//     res.status(200).json(recipe);
//   } catch (error) {
//     next(HttpError(500, error.message));
//   }
// };

// export default ctrlWrapper(getRecipeById);

