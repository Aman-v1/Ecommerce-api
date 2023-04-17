import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc  Create new review
// @route  Post /api/v1/reviews
// @access Private/Admin

export const createReview = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body;
  //1. Find the product
  const { id } = req.params;
  const productFound = await Product.findById(id).populate('reviews');
  if (!productFound) {
    throw new Error('Product Not Found');
  }
  // check if user already reviewed this product

  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasReviewed) {
    throw new Error('You have already reviewd this product');
  }
  //create review
  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });
  // Push  review into product found
  productFound.reviews.push(review?._id);
  //resave
  await productFound.save();
  res.status(201).json({
    success: true,
    message: 'review created successfully',
  });
});
