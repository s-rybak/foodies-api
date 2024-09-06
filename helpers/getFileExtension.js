/**
 * Extracts and returns the file extension from a given file name.
 *
 * @param {string} fileName The name of the file from which to extract the extension.
 * @returns {string} The file extension in lowercase, or an empty string if no extension is found.
 */
export function getFileExtension(fileName) {
  return fileName.includes(".") ? fileName.split(".").pop().toLowerCase() : "";
}
