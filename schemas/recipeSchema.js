import Joi from "joi";

export const routerUserFavoriteRecipeSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
export const routerUserRecipeSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const queryRecipes = Joi.object({
  ownerId: Joi.string().uuid(),
  ingredient: Joi.alternatives(
      Joi.string().uuid(),
      Joi.array().items(Joi.string().uuid())
  ).optional(),
  category: Joi.alternatives(
      Joi.string().uuid(),
      Joi.array().items(Joi.string().uuid())
  ).optional(),
  area: Joi.alternatives(
      Joi.string().uuid(),
      Joi.array().items(Joi.string().uuid())
  ).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const createRecipeSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  instructions: Joi.string().required().messages({
    "string.empty": "Instructions are required",
    "any.required": "Instructions are required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  time: Joi.number().integer().required().messages({
    "string.empty": "Time is required",
    "any.required": "Time is required",
  }),
  categoryId: Joi.string().required().uuid().messages({
    "string.empty": "Category ID is required",
    "any.required": "Category ID is required",
  }),
  areaId: Joi.string().required().uuid().messages({
    "string.empty": "Area ID is required",
    "any.required": "Area ID is required",
  }),
  ingredients: Joi.array()
      .items(
          Joi.object({
            id: Joi.string().uuid().required(),
            measure: Joi.string().required(),
          })
      )
      .required()
      .messages({
        "any.required": "Ingredients is required",
      }),
});
