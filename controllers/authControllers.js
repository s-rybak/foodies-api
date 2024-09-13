import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { emailConfirmationHtml } from "../emails/emailTemplates.js";
import { jwtTokenExpirationTime } from "../constants/constants.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";
import emailServices from "../services/emailServices.js";
import authServices from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";

const { BASE_URL, JWT_SECRET } = process.env;

/**
 * Controller to handle user registration.
 *
 * It creates a new user in the database, sends a verification email,
 * and responds with the user's name and email.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const registerUser = async (req, res) => {
  // Create user in database
  const { name, email, verificationToken } = await authServices.createUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // Send a verification email to the user's email address for email verification
  await emailServices.sendEmail({
    to: email,
    subject: "Confirm Your Email Address",
    html: emailConfirmationHtml(
      `${BASE_URL}/api/auth/verify/${verificationToken}`,
      false, // false is for the case when email is sent for the first time (varying text content)
      name
    ),
  });

  // Reply with created user data
  res.status(201).json({
    user: {
      name,
      email,
    },
  });
};

/**
 * Controller to handle resending email verification.
 *
 * It resends a verification email to the user's email address if it hasn't been verified yet.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 *
 * @throws {HttpError} Passes the error to the next middleware if the user is not found or the email is already verified.
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
  await emailServices.sendEmail({
    to: email,
    subject: "Resent: Confirm Your Email Address",
    html: emailConfirmationHtml(
      `${BASE_URL}/api/auth/verify/${user.verificationToken}`,
      true, // true is for the case when email is sent not for the first time (varying text content)
      user.name
    ),
  });

  // Reply with success message
  res.json({
    message: "Verification email sent",
  });
};

/**
 * Controller to handle email verification.
 *
 * It verifies the user's email based on the verification token
 * provided in the request parameters.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 *
 * @throws {HttpError} Passes the error to the next middleware if the user is not found.
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
 *
 * It authenticates the user based on email and password, checks email verification status,
 * and returns a JWT token together with user data if successful.
 *
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 *
 * @throws {HttpError} Passes the error to the next middleware if user not found,
 * the email is not verified or if the email or password is wrong.
 */
const loginUser = async (req, res, next) => {
  // Retrieve request login data
  const { email, password } = req.body;

  // Find user in database based on email
  let user = await authServices.getUser({ email });

  // Check that a user with the specified email exists in the database
  if (!user) {
    return next(HttpError(401, "Email or password is wrong"));
  }

  // Check that the database user's email is verified
  if (!user.verify) {
    return next(HttpError(401, "Email is not verified"));
  }

  // Check that the user request and database passwords match
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return next(HttpError(401, "Email or password is wrong"));
  }

  // Create JWT token for user, signed using secret key
  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: jwtTokenExpirationTime,
  });

  // Update the user record with the new token
  user = await authServices.updateUser(user.id, { token });

  // Return response object containing token and user data
  res.json({
    token: user.token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatar,
    },
  });
};

/**
 * Controller to handle user logout.
 *
 * It removes the user's token, effectively setting it to null.
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
  resendEmailVerify: ctrlWrapper(resendEmailVerify),
  verifyUserEmail: ctrlWrapper(verifyUserEmail),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
};
