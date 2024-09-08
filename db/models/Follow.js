import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Follow = sequelize.define(
  'follow',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
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
    timestamps: true,
  }
);

export default Follow;
