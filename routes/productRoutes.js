import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/productsController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productRoutes = express.Router();

productRoutes.post('/', isLoggedIn, createProduct);
productRoutes.get('/', getProducts);
productRoutes.get('/:id', getProduct);
productRoutes.put('/:id', isLoggedIn, updateProduct);
productRoutes.delete('/:id/delete', isLoggedIn, deleteProduct);

export default productRoutes;
