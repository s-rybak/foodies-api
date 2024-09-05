import { Router } from "express";

import {
  authEmailUserReqBodyValidationMiddleware,
  authLoginUserReqBodyValidationMiddleware,
  authRegisterUserReqBodyValidationMiddleware,
} from "../middlewares/authRequestValidationMiddleware.js";
import authenticateMiddleware from "../middlewares/authenticateMiddleware.js";
import authControllers from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post(
  "/register",
  authRegisterUserReqBodyValidationMiddleware,
  authControllers.registerUser
);

authRouter.post(
  "/verify",
  authEmailUserReqBodyValidationMiddleware,
  authControllers.resendEmailVerify
);

authRouter.get("/verify/:verificationToken", authControllers.verifyUserEmail);

authRouter.post(
  "/login",
  authLoginUserReqBodyValidationMiddleware,
  authControllers.loginUser
);

authRouter.post("/logout", authenticateMiddleware, authControllers.logoutUser);

export default authRouter;
