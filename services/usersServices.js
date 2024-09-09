import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';

import User from '../db/models/User.js';
import Follow from '../db/models/Follow.js';
import Recipe from '../db/models/Recipe.js';
import UserFavorite from "../db/models/UserFavorite.js";
import HttpError from "../helpers/HttpError.js";

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
        where: {...query},
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
        where: {id},
        returning: true,
    });

    return rows ? updateReply?.dataValues : null;
}

async function getUserFollowers(userId, pagination = {}) {
    const {page = 1, limit = 10} = pagination;
    const normalizedLimit = Number(limit);
    const offset = (Number(page) - 1) * normalizedLimit;

    try {
        const followers = await Follow.findAll({
            where: {followedId: userId},
            include: [
                {
                    model: User,
                    as: 'follower',
                    attributes: ['id', 'name', 'avatar'],
                    include: [
                        {
                            model: Recipe,
                            as: 'recipes',
                            attributes: ['id'],
                        },
                    ],
                },
            ],
            attributes: [],
            offset,
            limit: normalizedLimit,
        });

        const followersCount = await Follow.count({
            where: {followedId: userId},
        });

        const result = followers.map(follow => ({
            id: follow.follower.id,
            name: follow.follower.name,
            avatar: follow.follower.avatar,
            recipeCount: follow.follower.recipes.length,
        }));

        return {
            followersCount,
            users: result,
            totalPages: Math.ceil(followersCount / normalizedLimit),
            currentPage: page,
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getUserFollowing(userId, pagination = {}) {
    const {page = 1, limit = 10} = pagination;
    const normalizedLimit = Number(limit);
    const offset = (Number(page) - 1) * normalizedLimit;

    try {
        const following = await Follow.findAll({
            where: {'$follow.followerId$': userId},
            include: [
                {
                    model: User,
                    as: 'followed',
                    attributes: ['id', 'name', 'avatar'],
                    include: [
                        {
                            model: Recipe,
                            as: 'recipes',
                            attributes: ['id'],
                        },
                    ],
                },
            ],
            attributes: ['followerId', 'followedId'],
            offset,
            limit: normalizedLimit,
        });

        const followingCount = await Follow.count({
            where: {followerId: userId},
        });

        const result = following.map(follow => ({
            id: follow.followed.id,
            name: follow.followed.name,
            avatar: follow.followed.avatar,
            recipeCount: follow.followed.recipes.length,
        }));

        return {
            followingCount,
            users: result,
            totalPages: Math.ceil(followingCount / normalizedLimit),
            currentPage: page,
        };
    } catch (error) {
        throw new Error(error.message);
    }
}


const getUserDetails = async (userId, authUserId) => {
    const user = await User.findOne({
        where: {id: userId},
    });
    const createRecipeCount = await Recipe.count({owner: userId});
    const followersUserCount = await Follow.count({
        followerId: userId,
    });

    if (!user) {
        return null;
    }

    if (userId === authUserId) {
        const countFavouriteRecipe = await UserFavorite.count({
            ownerId: authUserId,
        });
        const followingUsersCount = await Follow.count({
            followingId: authUserId,
        });

        return {
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            createRecipeCount,
            countFavouriteRecipe,
            followingUsersCount,
            followersUserCount,
        };
    } else {
        return {
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            createRecipeCount,
            followersUserCount,
        };
    }
};

export default {
    createUser,
    getUser,
    updateUser,
    getUserDetails,
    getUserFollowers,
    getUserFollowing,
};
