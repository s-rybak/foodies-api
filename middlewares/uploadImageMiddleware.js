import uploadFile from "../decorators/uploadFile.js";
import {
  avatarAllowedExtensions,
  avatarMaxFileSizeKB,
} from "../constants/constants.js";

export const uploadAvatarImageMiddleware = uploadFile(
  avatarAllowedExtensions,
  avatarMaxFileSizeKB
);
