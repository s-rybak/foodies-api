
import { listRecipes } from "../services/recipesServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";


export const getAllRecipes = async (req, res, next) => {
  try {
    console.log("in controller");

    const { category, ingredient, region, page = 1, limit = 10 } = req.query || {};

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    if (isNaN(pageInt) || isNaN(limitInt) || pageInt <= 0 || limitInt <= 0) {
      return next(HttpError(400, "Invalid pagination parameters."));
    }

    const { count, rows } = await listRecipes({ category, ingredient, region, page: pageInt, limit: limitInt });

    if (count === 0) {
      return res.status(404).json({ message: "No recipes found." });
    }

    res.status(200).json({ total: count, recipes: rows });
  } catch (error) {
    if (error.name === "SequelizeDatabaseError") {
      return next(HttpError(500, "Database error occurred."));
    }
    next(error);
  }
};


export default ctrlWrapper(getAllRecipes);
