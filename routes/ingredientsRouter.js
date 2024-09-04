import { Router } from 'express';
import getAllIngredients from '../controllers/ingredientsController.js';

const ingredientsRouter = Router();

ingredientsRouter.get('/', getAllIngredients);

export default ingredientsRouter;
