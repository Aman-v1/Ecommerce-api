import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createColor, deleteColor, getAllColors, getSingleColor, updateColor } from '../controllers/colorController.js';
import isAdmin from '../middlewares/isAdmin.js';

const colorRoutes = express.Router();

colorRoutes.post('/', isLoggedIn, isAdmin, createColor);
colorRoutes.get('/', getAllColors);
colorRoutes.get('/:id', getSingleColor);
colorRoutes.put('/:id', isLoggedIn, isAdmin, updateColor);
colorRoutes.delete('/:id', isLoggedIn, isAdmin, deleteColor);

export default colorRoutes;
