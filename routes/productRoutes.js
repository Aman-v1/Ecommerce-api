import express from 'express';
import { createProduct, getProducts } from '../controllers/productsController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productRoutes = express.Router();

productRoutes.post('/', isLoggedIn, createProduct);
productRoutes.get('/', getProducts);

export default productRoutes;
