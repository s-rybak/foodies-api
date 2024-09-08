import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Follow = sequelize.define(
  'follow',
  {
    followerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    followedId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Follow;
