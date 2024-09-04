import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Area = sequelize.define(
  "areas",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

//Area.sync({ force: true });

export default Area;
