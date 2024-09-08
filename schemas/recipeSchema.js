import Joi from 'joi';

export const createRecipeSchema = Joi.object({
	title: Joi.string()
		.required()
		.messages({
			'string.empty': 'Title is required',
			'any.required': 'Title is required'
		}),
	instructions: Joi.string()
		.required()
		.messages({
			'string.empty': 'Instructions are required',
			'any.required': 'Instructions are required'
		}),
	description: Joi.string()
		.required()
		.messages({
			'string.empty': 'Description is required',
			'any.required': 'Description is required'
		}),
	thumb: Joi.string()
		.required()
		.messages({
			'string.empty': 'Thumbnail (thumb) is required',
			'any.required': 'Thumbnail (thumb) is required'
		}),
	time: Joi.string()
		.required()
		.messages({
			'string.empty': 'Time is required',
			'any.required': 'Time is required'
		}),
	categoryId: Joi.string()
		.required()
		.uuid()
		.messages({
			'string.empty': 'Category ID is required',
			'any.required': 'Category ID is required'
		}),
	areaId: Joi.string()
		.required()
		.uuid()
		.messages({
			'string.empty': 'Area ID is required',
			'any.required': 'Area ID is required'
		}),
	userId: Joi.string().uuid().optional(),
	ingredients: Joi.array()
		.items(
			Joi.object({
				id: Joi.string().uuid().required(),
				measure: Joi.string().required()
			})
		)
		.required()
		.messages({
			'any.required': 'Ingredients is required'
		}),
});
