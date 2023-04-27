import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from '../controllers/categoriesController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';
import isAdmin from '../middlewares/isAdmin.js';

const categoryRoutes = express.Router();

categoryRoutes.post('/', isLoggedIn, isAdmin, upload.single('file'), createCategory);
categoryRoutes.get('/', getAllCategories);
categoryRoutes.get('/:id', getSingleCategory);
categoryRoutes.put('/:id', isLoggedIn, isAdmin, updateCategory);
categoryRoutes.delete('/:id', isLoggedIn, isAdmin, deleteCategory);

export default categoryRoutes;
