import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';

// @descr  Create new coupon
// @route  Post /api/v1/coupons
// @access Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  //check if admin
  //check if coupon already exists
  const couponsExists = await Coupon.findOne({ code });
  if (couponsExists) {
    throw new Error('Coupon already exists');
  }
  // check if discount is a number
  if (isNaN(discount)) {
    throw new Error('Discount value must be a number');
  }
  //create coupon
  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });
  // send the response
  res.status(200).json({
    status: 'success',
    message: 'coupon created successfully',
    coupon,
  });
});

// @desc   get all coupons
// @route  Get /api/v1/ocoupons
// @access Private/Admin
export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: 'success',
    message: 'All coupons',
    coupons,
  });
});

// @desc    Get single coupon
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.query.code });
  //check if is not found
  if (coupon === null) {
    throw new Error('Coupon not found');
  }
  //check if expired
  if (coupon.isExpired) {
    throw new Error('Coupon Expired');
  }
  res.json({
    status: 'success',
    message: 'Coupon fetched',
    coupon,
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    }
  );
  res.json({
    status: 'success',
    message: 'Coupon updated successfully',
    coupon,
  });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: 'success',
    message: 'Coupon deleted successfully',
    coupon,
  });
});
