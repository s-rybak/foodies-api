import Testimonial from "../db/models/Testimonial.js";

export const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.findAll();
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const { testimonial } = req.body;
    const newTestimonial = await Testimonial.create({ testimonial });
    res.status(201).json(newTestimonial);
  } catch (error) {
    next(error);
  }
};
