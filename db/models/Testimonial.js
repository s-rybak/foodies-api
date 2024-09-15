import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import User from "./User.js";

const Testimonial = sequelize.define("testimonial", {
  testimonial: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

export default Testimonial;
