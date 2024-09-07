import Joi from 'joi';

export const createRecipeSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({ "any.required": "Title is required" }),

  category: Joi.string()
    .required()
    .messages({ "any.required": "Category is required" }),

  area: Joi.string()
    .required()
    .messages({ "any.required": "Area is required" }),

  instructions: Joi.string()
    .required()
    .messages({ "any.required": "Instructions are required" }),

  description: Joi.string()
    .optional()
    .allow('')
    .messages({ "string.empty": "Description can be empty" }),

  thumb: Joi.string()
    .optional()
    .allow('')
    .messages({ "string.empty": "Thumb can be empty" }),

  time: Joi.string()
    .required()
    .messages({ "any.required": "Time is required" }),

  ingredients: Joi.string()
    .required()
    .messages({ "any.required": "Ingredients are required" }),

  owner: Joi.number()
    .integer()
    .required()
    .messages({ "any.required": "Owner is required" }),
});
