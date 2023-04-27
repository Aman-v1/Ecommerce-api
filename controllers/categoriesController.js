import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

// @desc   Create new category
// @route  Post /api/v1/products/:id
// @access Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //category exists
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error('Category already exists');
  }
  //create
  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path,
  });

  res.json({
    status: 'success',
    message: 'Category created successfully',
    category,
  });
});

// @descr  Get all categories
// @route  Post /api/categories
// @access Public
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.json({
    status: 'success',
    message: 'Categories fetched successfully',
    categories,
  });
});

// @descr  Get single category
// @route  Post /api/categories/:id
// @access Public
export const getSingleCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  res.json({
    status: 'success',
    message: 'Categoy fetched successfully',
    category,
  });
});

// @descr  Update category
// @route  Put /api/v1/categories/:id
// @access Private/Admin

export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //update
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  res.json({
    status: 'success',
    message: 'Category updated successfully',
    category,
  });
});

// @descr  Delete category
// @route  Delete /api/v1/categories/:id
// @access Private/Admin

export const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);

  res.json({
    status: 'success',
    message: 'Category deleted successfully',
  });
});
