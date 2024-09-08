import { DataTypes } from 'sequelize';

import sequelize from '../sequelize.js';
import { emailRegex } from '../../constants/constants.js';
import Follow from './Follow.js';

/**
 * Sequelize model for User.
 */
const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: emailRegex,
        len: [6, 254],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: null,
      validate: {
        notEmpty: true,
      },
    },
    verify: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: null,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    hooks: {
      afterFind: result => {
        if (Array.isArray(result)) {
          result.forEach(record => {
            delete record.dataValues.updatedAt;
            delete record.dataValues.createdAt;
          });
        } else if (result) {
          delete result.dataValues.updatedAt;
          delete result.dataValues.createdAt;
        }
      },
      afterCreate: record => {
        delete record.dataValues.updatedAt;
        delete record.dataValues.createdAt;
      },
      afterUpdate: record => {
        delete record.dataValues.updatedAt;
        delete record.dataValues.createdAt;
      },
      afterDestroy: record => {
        delete record.dataValues.updatedAt;
        delete record.dataValues.createdAt;
      },
    },
  }
);
User.hasMany(Follow, { foreignKey: 'followerId', as: 'Followers' });
User.hasMany(Follow, { foreignKey: 'followedId', as: 'Following' });

// User.sync({ force: true });

export default User;
