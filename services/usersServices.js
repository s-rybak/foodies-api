import bcrypt from "bcrypt";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

import User from "../db/models/User.js";
import Follow from "../db/models/Follow.js";
import {
  defaultAvatarFileName,
  defaultRelAvatarFolderPath,
} from "../constants/constants.js";

/**
 * Registers a new user.
 *
 * @param {Object} data The data for creating a new user.
 * @param {string} data.name The name of the user.
 * @param {string} data.email The email of the user.
 * @param {string} data.password The password of the user.
 * @returns {<Object>} The created user data.
 * @throws {Error} If the email is already in use or other Sequelize errors occur.
 */
async function createUser(data) {
  try {
    const hashPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = uuidv4();
    const avatarURL = path.join(
      ...defaultRelAvatarFolderPath,
      defaultAvatarFileName
    );

    const registeredUser = await User.create({
      ...data,
      password: hashPassword,
      avatar: avatarURL,
      verificationToken,
    });

    return registeredUser.dataValues;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      error.message = "Email in use";
    }
    throw error;
  }
}

/**
 * Retrieves a user based on the query.
 *
 * @param {Object} query The query to find the user.
 * @returns {<Object|null>} The user data if found, or null if not found.
 * @throws {Error} If an error occurs while retrieving the user.
 */
async function getUser(query) {
  let user;
  try {
    const result = await User.findOne({
      where: { ...query },
    });
    user = result?.dataValues;
  } catch (error) {
    error.message = `Failed to retrieve user: ${error.message}`;
    throw error;
  }
  return user || null;
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
  let affectedRows;
  try {
    [affectedRows] = await User.update(data, { where: { id } });
  } catch (error) {
    error.message = `Error: while updating user with ID '${id}': ${error.message}`;
    throw error;
  }
  const updatedUser = await getUser({ id });
  if (!affectedRows && updatedUser) {
    throw HttpError(
      400,
      "Nothing to update or update was not effective while updating user"
    );
  }
  if (!updatedUser) {
    return null;
  }
  return updatedUser;
}
/**
 * ======================================
 * // ветка follow-unfollow
 * ======================================
 */

/**
 * @param {string} currentUserId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const followUser = async (currentUserId, userId) => {
  return await Follow.create({
    followerId: currentUserId,
    followingId: userId,
  });
};

/**
 * @param {string} currentUserId
 * @param {string} userId
 * @returns {Promise<number>}
 */
const unfollowUser = async (currentUserId, userId) => {
  return await Follow.destroy({
    where: {
      followerId: currentUserId,
      followingId: userId,
    },
  });
};

export default {
  createUser,
  getUser,
  updateUser,
  followUser, // ветка follow-unfollow
  unfollowUser, // ветка follow-unfollow
};
