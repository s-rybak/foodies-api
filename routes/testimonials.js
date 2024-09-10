import express from "express";
import {
  getAllTestimonials,
  createTestimonial,
} from "../controllers/testimonials.js";

const router = express.Router();

router.get("/", getAllTestimonials);
router.post("/", createTestimonial);

export default router;
