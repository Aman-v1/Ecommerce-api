import express from 'express';
import { createReview } from '../controllers/reviewController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const reviewRoutes = express.Router();

reviewRoutes.post('/:id', isLoggedIn, createReview);

export default reviewRoutes;
