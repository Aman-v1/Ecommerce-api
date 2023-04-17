import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createColor, deleteColor, getAllColors, getSingleColor, updateColor } from '../controllers/colorController.js';

const colorRoutes = express.Router();

colorRoutes.post('/', isLoggedIn, createColor);
colorRoutes.get('/', getAllColors);
colorRoutes.get('/:id', getSingleColor);
colorRoutes.put('/:id', updateColor);
colorRoutes.delete('/:id', deleteColor);

export default colorRoutes;
