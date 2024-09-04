import Joi from "joi";

export const createRecipeSchema = Joi.object({
	title: Joi.string().min(3).max(100).required().messages({
		'string.empty': 'Title is required.',
		'string.min': 'Title must be at least 3 characters long.',
		'string.max': 'Title cannot exceed 100 characters.',
	}),
	category: Joi.string().required().messages({
		'string.empty': 'Category is required.',
	}),
	area: Joi.string().required().messages({
		'string.empty': 'Area is required.',
	}),
	instructions: Joi.string().min(10).required().messages({
		'string.empty': 'Instructions are required.',
		'string.min': 'Instructions must be at least 10 characters long.',
	}),
	description: Joi.string().optional(),
	thumb: Joi.string().uri().optional().messages({
		'string.uri': 'Thumbnail must be a valid URL.',
	}),
	time: Joi.string().optional(),
	ingredients: Joi.array()
		.items(Joi.object({
			id: Joi.string().required(),
			measure: Joi.string().required(),
		}))
		.min(1)
		.required()
		.messages({
			'array.min': 'At least one ingredient is required.',
		}),
});

export default { createRecipeSchema };
