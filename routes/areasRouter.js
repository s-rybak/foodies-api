import { Router } from "express";
import getAllAreas from "../controllers/areasController.js";

const areasRouter = Router();
areasRouter.get("/", getAllAreas);

export default areasRouter;
