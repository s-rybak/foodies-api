import * as fs from "node:fs/promises";
import path from "node:path";

import { defaultPublicFolderName } from "../constants/constants.js";

/**
 * Saves a file to the server's file system.
 *
 * @param {Object} file The file object containing file data.
 * @param {Array<string>} [targetFolderPathArr=[]] The target folder path array where the file should be saved.
 * @param {string} [filePrefix=""] The prefix to add to the file name.
 * @param {string} [oldRelPath] The relative path of the old file to be removed.
 * @param {string} [defaultFileName] The default file name to compare against when deleting the old file.
 * @returns {<string>} The relative path of the newly saved file.
 * @throws {Error} Throws an error if file operations fail.
 */
export const saveFileToServerFileSystem = async (
  file,
  targetFolderPathArr = [],
  filePrefix = "",
  oldRelPath,
  defaultFileName
) => {
  // Move file from `temp` folder to target folder
  const { path: tempAbsPath, filename } = file;
  const newAbsPath = path.join(
    defaultPublicFolderName,
    ...targetFolderPathArr,
    filePrefix ? filePrefix + "_" + filename : filename
  );
  await fs.rename(tempAbsPath, newAbsPath);

  // Clean-up - remove old file if not default
  if (oldRelPath && defaultFileName) {
    // Obtain old file absolute path for future deletion
    const oldAbsPath =
      oldRelPath && path.resolve(defaultPublicFolderName, oldRelPath);

    const defaultAbsPath = path.resolve(
      defaultPublicFolderName,
      ...targetFolderPathArr,
      defaultFileName
    );
    if (oldAbsPath && oldAbsPath !== defaultAbsPath) {
      removeFile(oldAbsPath);
    }
  }

  const newRelPath = path.join(
    ...targetFolderPathArr,
    filePrefix ? filePrefix + "_" + filename : filename
  );

  return newRelPath;
};

/**
 * Removes a file at the given path.
 *
 * This function attempts to delete the specified file. If the file does not
 * exist, it logs an error and continues. If there are any permission issues
 * or other errors, it logs appropriate error messages. Returns true if the
 * file is successfully deleted, otherwise returns false.
 *
 * @param {string} path - The path to the file to be deleted.
 * @returns {boolean} true if the file is deleted, otherwise false.
 */
export const removeFile = async path => {
  // Attempt to delete the old file.
  // Full error handling is implemented to ensure that the process continues
  // even if an error occurs during the file deletion.
  try {
    // Check if file exists
    await fs.access(path);
    // Delete file
    await fs.unlink(path);

    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      // File does not exist
      console.error("File to delete not found");
    } else if (error.code === "EACCES") {
      // Permission denied
      console.error("Permission denied while deleting file");
    } else {
      // Other errors
      console.error(`Error deleting file: ${error.message}`);
    }

    return false;
  }
};

export default { saveFileToServerFileSystem };
