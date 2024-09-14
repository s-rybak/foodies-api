import Testimonial from "../db/models/Testimonial.js";
import User from "../db/models/User.js";

/**
 * Rerurns all testimonials
 * @param page
 * @param limit
 * @returns {Promise<Model[]>}
 */
async function getAllTestimonials(page, limit) {

    const rows = await Testimonial.findAll({
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name',"avatar"]
            }
        ],
        offset: (page - 1) * limit,
        limit: limit,
        order: [['id', 'DESC']],
    });

    const count = await Testimonial.count();

    return {rows, count}

}

function createTestimonial(testimonial) {
    return Testimonial.create(testimonial);
}

export default {
    createTestimonial,
    getAllTestimonials
}