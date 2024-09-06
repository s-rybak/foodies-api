/**
  |============================
  | ветка follow-unfollow
  |============================
*/
import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Follow = sequelize.define("Follow", {
  followerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

export default Follow;
