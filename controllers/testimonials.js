import Testimonial from "../db/models/Testimonial.js";
import service from "../services/testimonialsService.js";

export const getTopTestimonials = async (req, res, next) => {
    try {
        const {page = 1, limit = 3} = req.query;
        const {rows,count} = await service.getAllTestimonials(page, limit);
        res.json({ total: count, testimonials: rows });
    } catch (error) {
        next(error);
    }
};

export const createTestimonial = async (req, res, next) => {
    try {
        const {id} = req.user
        const {testimonial} = req.body;
        const newTestimonial = await service.createTestimonial({
            testimonial,
            userId:id,
        });
        res.status(201).json(newTestimonial);
    } catch (error) {
        next(error);
    }
};
