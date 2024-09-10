// ветка follow-unfollow
import { Router } from "express";
import authenticateMiddleware from "../middlewares/authenticateMiddleware.js";
import usersControllers from "../controllers/usersControllers.js";

const followRouter = Router();

// Добавить пользователя в список подписок
followRouter.post(
  "/follow/:userId",
  authenticateMiddleware,
  usersControllers.followUser
);

// Удалить пользователя из списка подписок
followRouter.delete(
  "/unfollow/:userId",
  authenticateMiddleware,
  usersControllers.unfollowUser
);

export default followRouter;