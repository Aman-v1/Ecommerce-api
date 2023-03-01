import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @descr  Create new product
// @route  Post /api/v1/products
// @access Private/Admin

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, brand, sizes, colors, user, price, totalQty } = req.body;
  //If Product Exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error('Product Already Exists');
  }
  // create the product
  const product = await Product.create({
    name,
    description,
    category,
    brand,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
  });
  //push the product into category
  // send response
  res.json({
    status: 'success',
    message: 'Product created successfully',
    product,
  });
});

// @descr  Get all products
// @route  Get /api/v1/products
// @access Public

export const getProducts = asyncHandler(async (req, res) => {
  //query
  let productQuery = Product.find();
  //
  res.json({
    status: 'success',
    products,
  });
});
