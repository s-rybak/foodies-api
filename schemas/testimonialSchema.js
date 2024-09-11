import Joi from 'joi';

export const createTestimonialSchema = Joi.object({
    testimonial: Joi.string().min(100).max(255).required(),
})

export const getTopTestimonialsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});