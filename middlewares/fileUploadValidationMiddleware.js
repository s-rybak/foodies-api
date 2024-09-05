import * as fs from "node:fs/promises";

import HttpError from "../helpers/HttpError.js";

/**
 * Middleware for validating uploaded files in an HTTP request.
 *
 * This middleware performs two checks:
 * 1. Ensures that a file has been uploaded.
 * 2. Verifies that the uploaded file is not empty.
 *
 * If any of these checks fail, it generates an appropriate HTTP error
 * and passes it to the next middleware.
 *
 * @param {Object} req Express request object.
 * @param {Object} req.file Contains information about the uploaded file.
 * @param {Function} next Function to pass control to the next middleware.
 *
 * @throws {HttpError} Throws an error if no file is uploaded or if the file is empty.
 */
const fileUploadValidationMiddleware = async (req, _, next) => {
  // Check if the file is missing
  if (!req.file) {
    return next(
      new HttpError(400, {
        message:
          "No file uploaded. Please ensure that a file is included in your request.",
      })
    );
  }

  // Check if the uploaded file is empty and attempt to delete the empty file
  if (req.file.size === 0) {
    // Asynchronous method with full error handling
    try {
      await fs.unlink(req.file.path);
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

    return next(
      new HttpError(400, {
        message: `Uploaded file '${req.file.originalname}' is empty. Please upload a valid image file.`,
      })
    );
  }

  next();
};

export default fileUploadValidationMiddleware;
