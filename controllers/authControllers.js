import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { jwtTokenExpirationTime } from "../constants/constants.js";
import { emailConfirmationHtml } from "../emails/emailTemplates.js";

import ctrlWrapper from "../helpers/ctrlWrapper.js";
import sendEmail from "../services/emailServices.js";
import authServices from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET, BASE_URL } = process.env;

/**
 * Controller to handle user registration.
 * It creates a new user in the database, sends a verification email,
 * and responds with the user's name and email.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const registerUser = async (req, res) => {
  // Create user in database
  const { id, name, email, verificationToken } = await authServices.createUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // Send a verification email to the user's email address for email verification
  await sendEmail({
    to: email,
    subject: "Confirm Your Email Address",
    html: emailConfirmationHtml(
      `${BASE_URL}/api/auth/verify/${verificationToken}`,
      false,
      name
    ),
  });

  // Reply with created user data
  res.status(201).json({
    id,
    name,
    email,
  });
};

/**
 * Controller to handle email verification.
 * It verifies the user's email based on the verification token
 * provided in the request parameters.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 *
 * @throws {HttpError} Throws an error if the user is not found.
 */
const verifyUserEmail = async (req, res, next) => {
  // Retrieve verification token from request
  const { verificationToken } = req.params;

  // Find user related with obtained verification token
  const user = await authServices.getUser({ verificationToken });
  if (!user) {
    return next(HttpError(404, "User not found"));
  }

  // Mark user email as verified
  await authServices.updateUser(user.id, {
    verify: true,
    verificationToken: null,
  });

  // Reply with success message
  res.json({
    message: "Verification successful",
  });
};

/**
 * Controller to handle user login.
 * It authenticates the user based on email and password, checks
 * email verification status, and returns a JWT token if successful.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 *
 * @throws {HttpError} Throws an error if the email or password is wrong or if the email is not verified.
 */
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  // Find user in database based on email
  let user;
  try {
    user = await authServices.getUser({ email });
  } catch (error) {
    error.message = `Error: while login user and finding existing user: ${error.message}`;
    throw error;
  }

  // Check that a user with the specified email exists
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  // Check that the user's email is verified
  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
  }

  // Check that the user passwords match
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  // Create JWT token for user using secret key
  let token;
  try {
    const payload = {
      id: user.id,
    };
    token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: jwtTokenExpirationTime,
    });
  } catch (error) {
    error.message = `Error: An issue occurred while generating the authentication token: ${error.message}`;
    throw error;
  }

  // Update the user record with the new token
  user = await authServices.updateUser(user.id, { token });

  // Return response object containing token and user data
  res.json({
    token: user.token,
    user: {
      email: user.email,
      avatarURL: user.avatar,
    },
  });
};

/**
 * Controller to handle resending email verification.
 * It resends a verification email to the user's email address if it hasn't been verified yet.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 *
 * @throws {HttpError} Throws an error if the user is not found or the email is already verified.
 */
const resendEmailVerify = async (req, res, next) => {
  // Retrieve email from request
  const { email } = req.body;

  // Find user related with obtained email
  const user = await authServices.getUser({ email });
  if (!user) {
    return next(HttpError(404, "User not found"));
  }

  // Check whether the user's email has already been verified
  if (user.verify === true) {
    return next(HttpError(400, "Verification has already been passed"));
  }

  // Resend a verification email to the user's email address for email verification
  await sendEmail({
    to: email,
    subject: "Resent: Confirm Your Email Address",
    html: emailConfirmationHtml(
      `${BASE_URL}/api/auth/verify/${user.verificationToken}`,
      true,
      user.name
    ),
  });

  // Reply with success message
  res.json({
    message: "Verification email sent",
  });
};

/**
 * Controller to handle user logout.
 * It updates the user's token to null, effectively setting it to null.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const logoutUser = async (req, res) => {
  const { id } = req.user;
  await authServices.updateUser(id, { token: null });
  res.status(204).end();
};

export default {
  registerUser: ctrlWrapper(registerUser),
  verifyUserEmail: ctrlWrapper(verifyUserEmail),
  resendEmailVerify: ctrlWrapper(resendEmailVerify),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
};
