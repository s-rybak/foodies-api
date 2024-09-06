import HttpError from "../helpers/HttpError.js";

const validateQuery = schema => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export default validateQuery;
