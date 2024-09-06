import HttpError from "../helpers/HttpError.js";

/**
 * Middleware decorator for validating request body against a schema.
 * Returns a middleware function that validates the request body using
 * the provided schema.
 * If validation fails, it passes an HTTP 400 error to the next middleware
 * with the validation error message.
 * Otherwise, it calls `next()` to proceed to the next middleware.
 *
 * @param {Joi.ObjectSchema} schema Schema to validate the request body against.
 * @returns {Function} Middleware function for Express.js.
 */
const validateBody = schema => {
  return (req, _, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };
};

export default validateBody;
