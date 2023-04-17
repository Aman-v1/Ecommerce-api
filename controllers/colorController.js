import asyncHandler from 'express-async-handler';
import Brand from '../models/Brand.js';
import Color from '../models/Color.js';

// @descr  Create new color
// @route  Post /api/v1/colors
// @access Private/Admin
export const createColor = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //brand exists
  const colorFound = await Color.findOne({ name });
  if (colorFound) {
    throw new Error('Color already exists');
  }
  //create
  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({
    status: 'success',
    message: 'Color created successfully',
    color,
  });
});

// @descr  Get all colors
// @route  Post /api/colorss
// @access Public
export const getAllColors = asyncHandler(async (req, res) => {
  const colors = await Color.find();

  res.json({
    status: 'success',
    message: 'Colors fetched successfully',
    colors,
  });
});

// @descr  Get single color
// @route  Post /api/color/:id
// @access Public
export const getSingleColor = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);

  res.json({
    status: 'success',
    message: 'Color fetched successfully',
    color,
  });
});

// @descr  Update Color
// @route  Put /api/v1/colors/:id
// @access Private/Admin

export const updateColor = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //update
  const color = await Color.findByIdAndUpdate(
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
    message: 'Color updated successfully',
    color,
  });
});

// @descr  Delete Color
// @route  Delete /api/v1/colors/:id
// @access Private/Admin

export const deleteColor = asyncHandler(async (req, res) => {
  await Color.findByIdAndDelete(req.params.id);

  res.json({
    status: 'success',
    message: 'Color deleted successfully',
  });
});
