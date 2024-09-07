import { DataTypes } from "sequelize";

import sequelize from "../sequelize.js";
import User from "./User.js";

const UserRelationships = sequelize.define(
  "user_relationship",
  {
    follower_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    following_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["follower_id", "following_id"],
      },
    ],
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

User.belongsToMany(User, {
  through: UserRelationships,
  as: "Followers",
  foreignKey: "following_id",
  otherKey: "follower_id",
});

User.belongsToMany(User, {
  through: UserRelationships,
  as: "Following",
  foreignKey: "follower_id",
  otherKey: "following_id",
});

// UserRelationships.sync({ force: true });

export default UserRelationships;
