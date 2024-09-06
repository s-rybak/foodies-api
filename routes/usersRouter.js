import { Router } from "express";

import authenticateMiddleware from "../middlewares/authenticateMiddleware.js";
import uploadImageMiddleware from "../middlewares/uploadImageMiddleware.js";
import multerErrorHandlingMiddleware from "../middlewares/multerErrorHandlingMiddleware.js";
import fileUploadValidationMiddleware from "../middlewares/fileUploadValidationMiddleware.js";
import usersControllers from "../controllers/usersControllers.js";

const usersRouter = Router();

usersRouter.get(
  "/current",
  authenticateMiddleware,
  usersControllers.getCurrentUser
);

usersRouter.get(
  "/:userId",
  authenticateMiddleware,
  usersControllers.getUserInfo
);

usersRouter.patch(
  "/avatars",
  authenticateMiddleware,
  uploadImageMiddleware.single("avatar"),
  multerErrorHandlingMiddleware,
  fileUploadValidationMiddleware,
  usersControllers.updateAvatar
);

export default usersRouter;