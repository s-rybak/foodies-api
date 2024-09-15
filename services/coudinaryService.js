import * as fs from "node:fs/promises";
import {v2 as cloudinary} from 'cloudinary';

const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

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
    console.log(file)
    // Move file from `temp` folder to target folder
    const {path: tempAbsPath, filename} = file;

    const uploadResult = await cloudinary.uploader
        .upload(
            tempAbsPath,
            {
                folder: "store",
                public_id: filename.slice(0, filename.lastIndexOf(".")),
            }
        )

    await fs.unlink(tempAbsPath);

    if (oldRelPath && defaultFileName) {

        await cloudinary.uploader.destroy(oldRelPath);

    }

    return uploadResult.url;
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
    const publicId = path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
    await cloudinary.uploader.destroy("store/" + publicId);
    return true;

};

export default {saveFileToServerFileSystem};
