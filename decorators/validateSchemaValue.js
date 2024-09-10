/**
 * Decorator for validating a value against multiple pattern checks in a Joi schema.
 * This function returns a Joi custom validation function that tests the value
 * against a set of regular expressions.
 * If any check fails, it accumulates error messages for all failed checks
 * and returns a combined error message.
 * Otherwise, it returns the valid value.
 *
 * @param {Array<{ regex: RegExp, tip: string }>} checksArr An array of objects
 * representing validation checks.
 * Each object must include:
 *   - `regex` {RegExp}: The regular expression pattern to test the value against.
 *   - `tip` {string}: The error message to provide if the value fails the pattern check.
 * @param {string} valueName The name of the value being validated, used in the error messages.
 *
 * @returns {Function} A Joi custom validation function.
 *   @param {string} value The value to be validated.
 *   @param {Object} helpers Joi helpers object used to return validation errors.
 *   @returns {string} The value if all checks pass. If any checks fail, returns
 *   an error message containing details of all failed checks.
 */
const validateSchemaValue = (checksArr, valueName) => {
  return (value, helpers) => {
    const errorMessages = [];
    for (const check of checksArr) {
      if (!check.regex.test(value)) {
        errorMessages.push(
          `${!errorMessages.length ? `'${valueName}' value ` : ""}${check.tip}`
        );
      }
    }

    if (errorMessages.length) {
      return helpers.message(
        `'${valueName}' validation error. ${errorMessages.join(", ")}`
      );
    }

    return value;
  };
};

export default validateSchemaValue;
