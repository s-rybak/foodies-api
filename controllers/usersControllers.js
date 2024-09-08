import * as fs from "node:fs/promises";
import path from "node:path";

import {
  defaultAvatarFileName,
  avatarsFolderRelPath,
} from "../constants/constants.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import usersServices from "../services/usersServices.js";
import fileServices from "../services/fileServices.js";
import User from "../db/models/User.js";
import Recipe from "../db/models/Recipe.js";
import Favorite from "../db/models/Favorite.js";

/**
 * Controller to get user information.
 * It retrieves the user's information and includes followers and following details
 * if the requested user ID matches the authenticated user's ID.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 */
/*const getUserInfo = (req, res) => {
  const { id, name, email, avatar, followers = [], following = [] } = req.user;

  const user = {
    id,
    name,
    email,
    avatar,
  };

  if (req.params.userId === id) {
    user.followers = followers;
    user.following = following;
  }

  res.json(user);
};
*/

const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const authUserId = req.user.id;
    const user = await User.findById(userId).select(
      "avatar name email followers following"
    );
    const createRecipeCount = await Recipe.countDocuments({ owner: userId });
    const followersUserCount = user.followers.length;

    if (!user) {
      return res.status(404).json({
        message: "There is no user with such id",
      });
    }
    if (userId === authUserId) {
      const countFavouriteRecipe = await Favorite.countDocuments({
        userId: authUserId,
      });
      const followingUsersCount = user.following.length;

      return res.json({
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        createRecipeCount,
        countFavouriteRecipe,
        followingUsersCount,
        followersUserCount,
      });
    } else {
      return res.json({
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        createRecipeCount,
        followersUserCount,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server Error ",
    });
  }
};

/**
 * Controller to get the list of users that the authenticated user is following.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const getFollowingUsers = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const authUser = await User.findById(authUserId)
      .select("following")
      .populate("following", "name avatar email");

    if (!authUser) {
      return res.status(404).json({
        message: "Authenticated user not found",
      });
    }

    return res.json({
      following: authUser.following,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * Controller to get the currently authenticated user's information.
 * It retrieves and sends the current user's ID, name, email, avatar followers, and following.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const getCurrentUser = (req, res) => {
  const { id, name, email, avatar, followers, following } = req.user;
  res.json({
    id,
    name,
    email,
    avatar,
    followersCount: followers.length,
    followingCount: following.length,
  });
};

/**
 * Controller to update the user's avatar.
 * It moves the uploaded avatar file from a temporary folder to the avatars folder,
 * and removes the old avatar file if it is not the default avatar.
 *
 * @param {Object} req Express request object.
 * @param {Object} req.file Contains information about the uploaded file.
 * @param {Object} req.user The authenticated user's data.
 * @param {Object} res Express response object.
 *
 * @throws {Error} Throws an error if there is an issue moving the file or updating the user record.
 */
const updateAvatar = async (req, res) => {
  // Move file from 'temp' to avatar folder and rename the file
  const newAvatarRelPath = await fileServices.saveFileToServerFileSystem(
    req.file,
    avatarsFolderRelPath,
    "avatar",
    req.user.avatar,
    defaultAvatarFileName
  );

  // Update user with new avatar relative path
  const { avatar } = await usersServices.updateUser(req.user.id, {
    avatar: newAvatarRelPath,
  });

  // Sent response with updated avatar URL data
  res.json({ avatar });
};

export default {
  getUserInfo: ctrlWrapper(getUserInfo),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  getUserDetails,
  getFollowingUsers,
};
