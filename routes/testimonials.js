import express from "express";
import {
    createTestimonial, getTopTestimonials,
} from "../controllers/testimonials.js";
import authenticateMiddleware from "../middlewares/authenticateMiddleware.js";
import validateBody from "../decorators/validateBody.js";
import {createTestimonialSchema, getTopTestimonialsSchema} from "../schemas/testimonialSchema.js";
import validateQuery from "../decorators/validateQuery.js";

const router = express.Router();

router.get("/", validateQuery(getTopTestimonialsSchema), getTopTestimonials);
router.post("/",authenticateMiddleware, validateBody(createTestimonialSchema), createTestimonial);

export default router;
