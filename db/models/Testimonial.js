import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Testimonial = sequelize.define("Testimonial", {
	testimonial: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

export default Testimonial;
