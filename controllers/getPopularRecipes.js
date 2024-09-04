
// import { getPopularRecipes } from "../services/recipesServices.js";
// import ctrlWrapper from "../helpers/ctrlWrapper.js";
// import HttpError from "../helpers/HttpError.js";


// const getPopularRecipesController = async (req, res, next) => {
//   try {
//     const recipes = await getPopularRecipes();
//     console.log("Retrieved recipes:", recipes);

//     if (!recipes || recipes.length === 0) {
//       return res.status(404).json({ message: "No popular recipes found." });
//     }

//     res.status(200).json(recipes);
//   } catch (error) {
//     next(HttpError(500, error.message));
//   }
// };

// export default ctrlWrapper(getPopularRecipesController);
