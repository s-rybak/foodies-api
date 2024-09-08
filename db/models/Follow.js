import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Follow = sequelize.define("follow", {
  followerId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
},{
    timestamps: false
});

export default Follow;
