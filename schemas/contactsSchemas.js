import Joi from "joi";

import { emailChecks } from "../constants/constants.js";
import validateSchemaValue from "../decorators/validateSchemaValue.js";
import { emailRegex } from "../constants/constants.js";

/**
 * An object of contact fields.
 *
 * @constant {object} fields
 */
const fields = Object.freeze({
  name: "name",
  email: "email",
  phone: "phone",
  favorite: "favorite",
  owner: "owner",
});

/**
 * An object of fields that are forbidden for contact update operation.
 *
 * @constant {object} forbiddenForUpdateFields
 */
const forbiddenForUpdateFields = Object.freeze({
  id: "id",
  [fields.favorite]: [fields.favorite],
  [fields.owner]: [fields.owner],
});

const validateEmail = validateSchemaValue(emailChecks, fields.email);

/**
 * Joi validation schema for creating a contact.
 * This schema validates that the required fields are present and correctly formatted.
 *
 * The schema checks for:
 * - A required string field (`name`).
 * - A required and valid email field (`email`) using pattern matching and additional custom validation.
 * - A required string field (`phone`).
 *
 * It provides custom error messages for missing or empty fields,
 * as well as for an invalid email format.
 *
 * Additionally, it checks for unrecognized fields in the request body
 * and lists the valid fields in the error message.
 */
export const contactCreateSchema = Joi.object({
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
  [fields.phone]: Joi.string()
    .required()
    .messages({
      "any.required": `'${fields.phone}' value is required`,
      "string.empty": `'${fields.phone}' value cannot be empty`,
    }),
}).messages({
  "object.unknown": `an unrecognized field {{#label}} was provided, valid fields are: '${Object.values(
    fields
  ).join("', '")}'`,
});

/**
 * Joi validation schema for updating a contact.
 * This schema allows partial updates by validating that at least one of the
 * optional fields (`name`, `email`, or `phone`) is provided.
 *
 * The schema checks for:
 * - An optional string field (`name`).
 * - An optional and valid email field (`email`) using pattern matching and additional custom validation.
 * - An optional string field (`phone`).
 *
 * It provides custom error messages for empty fields, invalid email format,
 * and missing fields if none of the optional fields are provided.
 *
 * Additionally, it strictly checks for unrecognized fields and lists valid fields
 * in the error message if an unknown field is encountered.
 */
export const contactUpdateSchema = Joi.object({
  [fields.name]: Joi.string().messages({
    "string.empty": `'${fields.name}' value cannot be empty`,
  }),
  [fields.email]: Joi.string()
    .custom(validateEmail)
    .pattern(emailRegex)
    .messages({
      "string.empty": `'${fields.email}' value cannot be empty`,
      "string.pattern.base": `'${fields.email}' should be valid email`,
    }),
  [fields.phone]: Joi.string().messages({
    "string.empty": `'${fields.phone}' value cannot be empty`,
  }),
  [forbiddenForUpdateFields.id]: Joi.forbidden().messages({
    "any.unknown": `'${forbiddenForUpdateFields.id}' field is not allowed in this request`,
  }),
  [forbiddenForUpdateFields.favorite]: Joi.forbidden().messages({
    "any.unknown": `'${forbiddenForUpdateFields.favorite}' field is not allowed in this request - use other endpoint to change favorite status`,
  }),
  [forbiddenForUpdateFields.owner]: Joi.forbidden().messages({
    "any.unknown": `'${forbiddenForUpdateFields.owner}' field is not allowed in this request - user is not allowed to change contact owner`,
  }),
})
  .or(...Object.values(fields))
  .strict()
  .messages({
    "object.unknown": "an unrecognized field {{#label}} was provided",
    "object.missing": `body must have at least one field, valid fields are: '${Object.values(
      fields
    ).join("', '")}'`,
  });

/**
 * Joi validation schema for updating the "favorite" status of a contact.
 * The schema ensures that only the "favorite" field is accepted in the request body.
 */
export const contactUpdateContactStatusSchema = Joi.object({
  [fields.favorite]: Joi.bool()
    .required()
    .messages({
      "any.required": `'${fields.favorite}' value is required`,
    }),
});
