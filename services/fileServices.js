import * as fs from "node:fs/promises";
import path from "node:path";

import { defaultPublicFolderName } from "../constants/constants.js";

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
