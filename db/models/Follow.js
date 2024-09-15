import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import User from "./User.js";

const Follow = sequelize.define(
  "follow",
  {
    followerId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    followedId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);

Follow.belongsTo(User, {
  foreignKey: "followerId",
  as: "follower",
});

Follow.belongsTo(User, {
  foreignKey: "followedId",
  as: "followed",
});

export default Follow;
