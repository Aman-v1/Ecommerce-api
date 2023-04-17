import asyncHandler from 'express-async-handler';
import Brand from '../models/Brand.js';

// @descr  Create new brand
// @route  Post /api/v1/brand
// @access Private/Admin
export const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //brand exists
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error('Category already exists');
  }
  //create
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({
    status: 'success',
    message: 'Brand created successfully',
    brand,
  });
});

// @descr  Get all brands
// @route  Post /api/brands
// @access Public
export const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();

  res.json({
    status: 'success',
    message: 'Brands fetched successfully',
    brands,
  });
});

// @descr  Get single brand
// @route  Post /api/brand/:id
// @access Public
export const getSingleBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  res.json({
    status: 'success',
    message: 'Brand fetched successfully',
    brand,
  });
});

// @descr  Update Brand
// @route  Put /api/v1/brands/:id
// @access Private/Admin

export const updateBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //update
  const brand = await Brand.findByIdAndUpdate(
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
    message: 'Brand updated successfully',
    brand,
  });
});

// @descr  Delete Brand
// @route  Delete /api/v1/brands/:id
// @access Private/Admin

export const deleteBrand = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);

  res.json({
    status: 'success',
    message: 'Brand deleted successfully',
  });
});
