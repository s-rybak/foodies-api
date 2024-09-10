import { Router } from 'express';

import authenticateMiddleware from '../middlewares/authenticateMiddleware.js';
import { uploadAvatarImageMiddleware } from '../middlewares/uploadImageMiddleware.js';
import multerErrorHandlingMiddleware from '../middlewares/multerErrorHandlingMiddleware.js';
import fileUploadValidationMiddleware from '../middlewares/fileUploadValidationMiddleware.js';
import usersControllers from '../controllers/usersControllers.js';

const usersRouter = Router();

usersRouter.get(
  '/current',
  authenticateMiddleware,
  usersControllers.getCurrentUser
);

usersRouter.get(
  '/:userId/followers',
  authenticateMiddleware,
  usersControllers.getFollowers
);
usersRouter.get(
  '/:userId/following',
  authenticateMiddleware,
  usersControllers.getFollowing
);

usersRouter.get(
  "/:userId",
  authenticateMiddleware,
  usersControllers.getUserDetailsController
);

usersRouter.patch(
  '/avatars',
  authenticateMiddleware,
  uploadAvatarImageMiddleware.single('avatar'),
  multerErrorHandlingMiddleware,
  fileUploadValidationMiddleware,
  usersControllers.updateAvatar
);

export default usersRouter;
