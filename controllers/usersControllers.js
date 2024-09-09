import * as fs from 'node:fs/promises';
import path from 'node:path';

import {
    defaultAvatarFileName,
    avatarsFolderRelPath,
} from '../constants/constants.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';

import usersServices from '../services/usersServices.js';
import fileServices from '../services/fileServices.js';
import Follow from "../db/models/Follow.js";

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

// controllers/userController.js

//const { getUserDetails } = require("../services/userService");

/**
 * Controller to get user details.
 *
 * @param {Object} req - Express request object. Must include `userId` parameter and authenticated user data.
 * @param {Object} res - Express response object. Sends a JSON response with user details.
 *
 * @returns {void}
 */
const getUserDetailsController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const authUserId = req.user.id;
        const userDetails = await usersServices.getUserDetails(userId, authUserId);
        if (!userDetails) {
            return res.status(404).json({message: "User not found"});
        }
        return res.json(userDetails);
    } catch (error) {
        return res.status(500).json({message: "Server Error"});
    }
};

/**
 * Controller to get the currently authenticated user's information.
 * It retrieves and sends the current user's ID, name, email, avatar followers, and following.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const getCurrentUser = async (req, res) => {
    try {
        const {id, name, email, avatar} = req.user;
        const followersCount = await Follow.count({followingId: id});
        const followingCount = await Follow.count({followerId: id});

        res.json({
            id,
            name,
            email,
            avatar,
            followersCount,
            followingCount,
        });
    } catch (error) {
        return res.status(500).json({message: "Server Error"});
    }
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
        'avatar',
        req.user.avatar,
        defaultAvatarFileName
    );

    // Update user with new avatar relative path
    const {avatar} = await usersServices.updateUser(req.user.id, {
        avatar: newAvatarRelPath,
    });

    // Sent response with updated avatar URL data
    res.json({avatar});
};

// Get info followers of a user.

const getFollowers = async (req, res, next) => {
    const {page = 1, limit = 10} = req.query;
    const {userId} = req.params;
    try {
        const followers = await usersServices.getUserFollowers(userId, {
            page,
            limit,
        });

        if (!followers || followers.length === 0) {
            throw HttpError(404, 'Followers not found');
        }

        res.status(200).json({followers});
    } catch (error) {
        next(error);
    }
};

// Get info of user following .

const getFollowing = async (req, res, next) => {
    const {page = 1, limit = 10} = req.query;
    const {userId} = req.params;
    try {
        const usersFollowing = await usersServices.getUserFollowing(userId, {
            page,
            limit,
        });

        if (!usersFollowing || usersFollowing.length === 0) {
            throw HttpError(404, 'User do not follow for others');
        }

        res.status(200).json({usersFollowing});
    } catch (error) {
        next(error);
    }
};

export default {
    //getUserInfo: ctrlWrapper(getUserInfo),
    getCurrentUser: ctrlWrapper(getCurrentUser),
    updateAvatar: ctrlWrapper(updateAvatar),
    getFollowers: ctrlWrapper(getFollowers),
    getFollowing: ctrlWrapper(getFollowing),
    getUserDetailsController: ctrlWrapper(getUserDetailsController),
};
