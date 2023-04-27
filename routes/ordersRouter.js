import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createOrder, getAllOrders, getOrder, getOrderStats, updateOrder } from '../controllers/orderController.js';

const orderRoutes = express.Router();

orderRoutes.post('/', isLoggedIn, createOrder);
orderRoutes.get('/', isLoggedIn, getAllOrders);
orderRoutes.get('/sales/stats', isLoggedIn, getOrderStats);
orderRoutes.get('/:id', isLoggedIn, getOrder);
orderRoutes.put('/update/:id', isLoggedIn, updateOrder);

export default orderRoutes;
