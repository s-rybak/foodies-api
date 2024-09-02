import { ValidationError } from "sequelize";
import HttpError from "./HttpError.js";

const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return next(HttpError(409, error.message));
      }
      if (error instanceof ValidationError) {
        return next(HttpError(400, error.message));
      }
      next(error);
    }
  };
};

export default ctrlWrapper;
