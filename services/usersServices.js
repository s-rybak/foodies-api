import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import User from '../db/models/User.js';
import Follow from '../db/models/Follow.js';
import Recipe from '../db/models/Recipe.js';

/**
 * Registers a new user.
 *
 * @param {Object} data The data for creating a new user.
 * @returns {<Object>} The created user data.
 * @throws {Error} If the email is already in use or other Sequelize errors occur.
 */
async function createUser(data) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = uuidv4();

    const reply = await User.create({
      ...data,
      password: hashedPassword,
      verificationToken,
    });

    return reply?.dataValues;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      error.message = 'Email in use';
    }
    throw error;
  }
}

/**
 * Retrieves a user based on the query.
 *
 * @param {Object} query The query to find the user.
 * @returns {<Object|null>} The user data if found, or null if not found.
 */
async function getUser(query) {
  const reply = await User.findOne({
    where: { ...query },
  });

  return reply?.dataValues || null;
}

/**
 * Updates the user by id.
 *
 * @param {string} id The id of the user to update.
 * @param {Object} data The data to update the user with.
 * @returns {<Object|null>} The updated user data if update is successful, or null if user not found.
 * @throws {Error} If an error occurs while updating the user or the update is not effective.
 */
async function updateUser(id, data) {
  const [rows, [updateReply]] = await User.update(data, {
    where: { id },
    returning: true,
  });

  return rows ? updateReply?.dataValues : null;
}

async function getUserFollowers(userId) {
  try {
    const followers = await User.findAll({
      include: [
        {
          model: Follow,
          as: 'Followers',
          where: { followedId: userId },
          attributes: [],
        },
        {
          model: Recipe,
          as: 'Recipes',
          attributes: ['id'],
        },
      ],
    });
    const result = followers.map(user => ({
      id: user.id,
      name: user.name,
      recipeCount: user.Recipes.length,
    }));

    return result;
    
  } catch (error) {
    throw new Error(error.message);
  }
}

export default {
  createUser,
  getUser,
  updateUser,
  getUserFollowers,
};
