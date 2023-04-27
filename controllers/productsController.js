import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';

// @descr  Create new product
// @route  Post /api/v1/products
// @access Private/Admin

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, brand, sizes, colors, price, totalQty } = req.body;
  const convertedImgs = req.files.map((file) => file?.path);
  //If Product Exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error('Product Already Exists');
  }
  // find the category
  const categoryFound = await Category.findOne({ name: category });
  if (!categoryFound) {
    throw new Error('Category not found, please create category first or check category name');
  }
  // find the brand
  const brandFound = await Brand.findOne({ name: brand.toLowerCase() });
  if (!brandFound) {
    throw new Error('Brand not found, please create brand first or check brand name');
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
    images: convertedImgs,
  });
  //push the product into category
  categoryFound.products.push(product._id);
  // resave
  await categoryFound.save();
  //push the product into brand
  brandFound.products.push(product._id);
  // resave
  await brandFound.save();
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

  //search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: 'i' },
    });
  }

  //filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: 'i' },
    });
  }

  //filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: 'i' },
    });
  }

  //filter by color
  if (req.query.colors) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.colors, $options: 'i' },
    });
  }

  //filter by color
  if (req.query.sizes) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.sizes, $options: 'i' },
    });
  }

  //filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split('-');
    //gte: greater or equal
    //lte: less or equal
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

  //startIdx
  const startIdx = (page - 1) * limit;
  //endIdx
  const endIdx = page * limit;
  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIdx).limit(limit);

  //pagination result
  const pagination = {};
  if (endIdx < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIdx > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //await the query
  const products = await productQuery.populate('reviews');

  res.json({
    status: 'success',
    total,
    results: products.length,
    pagination,
    message: 'Products fetched successfully',
    products,
  });
});

// @descr  Get single products
// @route  Get /api/v1/products/:id
// @access Public

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews');
  if (!product) {
    throw new Error('Product not found');
  }
  res.json({
    status: 'success',
    message: 'Product fetched successfully',
    product,
  });
});

// @descr  Update products
// @route  Put /api/v1/products/:id
// @access Public

export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, category, brand, sizes, colors, user, price, totalQty } = req.body;

  //update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      brand,
      sizes,
      colors,
      user,
      price,
      totalQty,
    },
    {
      new: true,
    }
  );
  res.json({
    status: 'success',
    message: 'Product updated successfully',
    product,
  });
});

// @descr  Delete products
// @route  Delete /api/v1/products/:id
// @access Public

export const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.json({
    status: 'success',
    message: 'Product deleted successfully',
  });
});
