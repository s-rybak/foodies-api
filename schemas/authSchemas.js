import Joi from "joi";

import { emailChecks, passwordChecks } from "../constants/constants.js";
import validateSchemaValue from "../decorators/validateSchemaValue.js";
import { emailRegex } from "../constants/constants.js";

/**
 * An object of authentication-related fields.
 *
 * @constant {object} fields
 */
const fields = Object.freeze({
  name: "name",
  email: "email",
  password: "password",
});

/**
 * Function to validate email values against multiple checks.
 */
const validateEmail = validateSchemaValue(emailChecks, fields.email);

/**
 * Function to validate password values against multiple checks.
 */
const validatePassword = validateSchemaValue(passwordChecks, fields.password);

/**
 * Joi validation schema for registering a user.
 * This schema validates that the required fields are present and correctly formatted.
 *
 * The schema checks for:
 * - A required name field with specific constraints using custom validation.
 * - A required and valid email field (`email`) using pattern matching and custom validation.
 * - A required password field (`password`) with specific constraints using custom validation.
 *
 * It provides custom error messages for missing or empty fields,
 * as well as for an invalid email format and password requirements.
 */
export const authRegisterUserSchema = Joi.object({
  [fields.name]: Joi.string()
    .required()
    .messages({
      "any.required": `'${fields.name}' value is required`,
      "string.empty": `'${fields.name}' value cannot be empty`,
    }),
  [fields.email]: Joi.string()
    .required()
    .custom(validateEmail)
    .pattern(emailRegex)
    .messages({
      "any.required": `'${fields.email}' value is required`,
      "string.empty": `'${fields.email}' value cannot be empty`,
      "string.pattern.base": `'${fields.email}' should be valid email`,
    }),
  [fields.password]: Joi.string()
    .required()
    .custom(validatePassword)
    .messages({
      "any.required": `'${fields.password}' value is required`,
      "string.empty": `'${fields.password}' value cannot be empty`,
    }),
});

/**
 * Joi validation schema for logging in a user.
 * This schema validates that the required fields are present and correctly formatted.
 *
 * The schema checks for:
 * - A required and valid email field (`email`) using pattern matching and additional custom validation.
 * - A required password field (`password`) with specific constraints using custom validation.
 *
 * It provides custom error messages for missing or empty fields,
 * as well as for an invalid email format using pattern matching and additional custom validation.
 */
export const authLoginUserSchema = Joi.object({
  [fields.email]: Joi.string()
    .required()
    .custom(validateEmail)
    .pattern(emailRegex)
    .messages({
      "any.required": `'${fields.email}' value is required`,
      "string.empty": `'${fields.email}' value cannot be empty`,
      "string.pattern.base": `'${fields.email}' should be valid email`,
    }),
  [fields.password]: Joi.string()
    .required()
    .custom(validatePassword)
    .messages({
      "any.required": `'${fields.password}' value is required`,
      "string.empty": `'${fields.password}' value cannot be empty`,
    }),
});

export const authEmailUserSchema = Joi.object({
  [fields.email]: Joi.string()
    .required()
    .custom(validateEmail)
    .pattern(emailRegex)
    .messages({
      "any.required": `missing required field '${fields.email}'`,
      "string.empty": `'${fields.email}' value cannot be empty`,
      "string.pattern.base": `'${fields.email}' should be valid email`,
    }),
});
