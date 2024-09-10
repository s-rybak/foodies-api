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
      // Attempt to delete the old file.
      // Full error handling is implemented to ensure that the process continues
      // even if an error occurs during the file deletion.
      try {
        // Check if the old file exists or throw an error
        await fs.access(oldAbsPath);
        // File exists, so attempt to delete it
        await fs.unlink(oldAbsPath);
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
    }
  }

  const newRelPath = path.join(
    ...targetFolderPathArr,
    filePrefix ? filePrefix + "_" + filename : filename
  );

  return newRelPath;
};

export default { saveFileToServerFileSystem };
