import path from "node:path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import { defaultTempFolderPathArr } from "../constants/constants.js";

import { getFileExtension } from "../helpers/getFileExtension.js";
import HttpError from "../helpers/HttpError.js";

/**
 * Middleware for handling file uploads using Multer.
 *
 * Configures Multer to use the specified storage settings, file size limits, and file filters.
 */
const uploadFile = (allowedExtensionsArr, maxFileSizeKB) => {
  // Define the destination directory for uploaded files
  const destination = path.resolve(...defaultTempFolderPathArr);

  /**
   * Configures the storage settings for Multer to handle file uploads.
   *
   * Files are stored in a directory specified by `destination` with a unique filename
   * generated using UUID and the original file extension.
   *
   * @param {Object} file The file object representing the uploaded file.
   * @param {Function} cb Callback function to pass control to the next middleware or to handle errors.
   */
  const storage = multer.diskStorage({
    destination,
    filename: (_, file, cb) => {
      const fileExtension = getFileExtension(file.originalname);
      const filename = uuidv4() + "." + fileExtension;
      cb(null, filename);
    },
  });

  // Define the maximum allowed file size for uploads (in bytes)
  const limits = {
    fileSize: 1024 * maxFileSizeKB,
  };

  /**
   * Middleware function to filter uploaded files based on file type.
   *
   * This function checks if the file extension of the uploaded file is within
   * the allowed formats. If not, it passes an error to the next middleware.
   *
   * @param {Object} file The file object representing the uploaded file.
   * @param {Function} cb Callback function to pass control to the next middleware or to handle errors.
   */
  const fileFilter = (_, file, cb) => {
    const fileExtension = getFileExtension(file.originalname);
    // Check if correct media type
    if (!allowedExtensionsArr.includes(fileExtension)) {
      return cb(
        HttpError(
          415,
          `Unsupported image format. Only '${allowedExtensionsArr.join(
            "', '"
          )}' formats are allowed.`
        )
      );
    }
    cb(null, true);
  };

  return multer({
    storage,
    limits,
    fileFilter,
  });
};

export default uploadFile;
