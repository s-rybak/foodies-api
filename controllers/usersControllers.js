import * as fs from "node:fs/promises";
import path from "node:path";

import {
  defaultAvatarFileName,
  defaultPublicFolderName,
  defaultRelAvatarFolderPath,
} from "../constants/constants.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import usersServices from "../services/usersServices.js";

const avatarsFolderAbsPath = path.resolve(
  defaultPublicFolderName,
  ...defaultRelAvatarFolderPath
);

/**
 * Controller to get user information.
 * It retrieves the user's information and includes followers and following details
 * if the requested user ID matches the authenticated user's ID.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 */
const getUserInfo = (req, res, next) => {
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

/**
 * Controller to get the currently authenticated user's information.
 * It retrieves and sends the current user's ID, name, email, and avatar.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const getCurrentUser = (req, res) => {
  const { id, name, email, avatar } = req.user;
  res.json({
    id,
    name,
    email,
    avatar,
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
  // Move avatar file from `temp` folder to `avatars` folder
  const { path: oldAbsTempPath, filename } = req.file;
  const newAbsAvatarPath = path.join(avatarsFolderAbsPath, filename);
  await fs.rename(oldAbsTempPath, newAbsAvatarPath);

  // Obtain old user avatar absolute path for future deletion
  const oldAvatarAbsPath = path.resolve(
    defaultPublicFolderName,
    req.user.avatar
  );

  // Update user with new avatar relative path
  const newRelPath = path.join(...defaultRelAvatarFolderPath, filename);
  const { avatar } = await usersServices.updateUser(req.user.id, {
    avatar: newRelPath,
  });

  // Clean-up - remove old user avatar file if not default avatar
  const defaultAbsAvatarPath = path.resolve(
    defaultPublicFolderName,
    ...defaultRelAvatarFolderPath,
    defaultAvatarFileName
  );
  if (oldAvatarAbsPath !== defaultAbsAvatarPath) {
    // Attempt to delete the old avatar file.
    // Full error handling is implemented to ensure that the process continues
    // even if an error occurs during the file deletion.
    try {
      // Check if the old avatar file exists or throw an error
      await fs.access(oldAvatarAbsPath);
      // File exists, so attempt to delete it
      await fs.unlink(oldAvatarAbsPath);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File does not exist
        console.error("File not found");
      } else if (error.code === "EACCES") {
        // Permission denied
        console.error("Permission denied");
      } else {
        // Other errors
        console.error(`Error deleting file: ${error.message}`);
      }
    }
  }

  // Sent response with updated avatar URL data
  res.json({
    avatar: avatar,
  });
};

export default {
  getUserInfo: ctrlWrapper(getUserInfo),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
