import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createCoupon, deleteCoupon, getAllCoupons, getCoupon, updateCoupon } from '../controllers/couponController.js';
import isAdmin from '../middlewares/isAdmin.js';

const couponRoutes = express.Router();

couponRoutes.post('/', isLoggedIn, isAdmin, createCoupon);
couponRoutes.get('/', isLoggedIn, getAllCoupons);
couponRoutes.get('/:code', isLoggedIn, getCoupon);
couponRoutes.put('/:id', isLoggedIn, isAdmin, updateCoupon);
couponRoutes.delete('/:id', isLoggedIn, isAdmin, deleteCoupon);

export default couponRoutes;
