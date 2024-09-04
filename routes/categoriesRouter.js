import { Router } from 'express';
import getAllcategories from '../controllers/categoriesController.js';
const categoriesRouter = Router();

categoriesRouter.get('/', getAllcategories);
export default categoriesRouter;
