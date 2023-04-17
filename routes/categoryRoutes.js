import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from '../controllers/categoriesController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const categoryRoutes = express.Router();

categoryRoutes.post('/', isLoggedIn, createCategory);
categoryRoutes.get('/', getAllCategories);
categoryRoutes.get('/:id', getSingleCategory);
categoryRoutes.put('/:id', updateCategory);
categoryRoutes.delete('/:id', deleteCategory);

export default categoryRoutes;
