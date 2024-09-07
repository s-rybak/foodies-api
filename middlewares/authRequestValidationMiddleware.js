import validateBody from "../decorators/validateBody.js";
import {
  authRegisterUserSchema,
  authLoginUserSchema,
  authEmailUserSchema,
} from "../schemas/authSchemas.js";

export const authRegisterUserReqBodyValidationMiddleware = validateBody(
  authRegisterUserSchema
);

export const authLoginUserReqBodyValidationMiddleware =
  validateBody(authLoginUserSchema);

export const authEmailUserReqBodyValidationMiddleware =
  validateBody(authEmailUserSchema);
