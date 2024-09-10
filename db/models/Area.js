import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Area = sequelize.define(
  "area",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// Area.sync({ force: true });

export default Area;
