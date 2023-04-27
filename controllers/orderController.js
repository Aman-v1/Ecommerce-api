import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// @desc  Create orders
// @route  Post /api/v1/orders
// @access Private

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrder = asyncHandler(async (req, res) => {
  //get coupon
  const { coupon } = req.query;
  let couponFound = null;
  if (coupon) {
    couponFound = await Coupon.findOne({
      code: coupon?.toUpperCase(),
    });
    if (couponFound?.isExpired) {
      throw new Error('Coupon has Expired');
    }
    if (!couponFound) {
      throw new Error('Coupon does not exist');
    }
  }

  //get discount
  const discount = couponFound?.discount / 100;

  //Get the payload(user, orderitems, shipping address, totalprice);
  const { orderItems, shippingAddress, totalPrice } = req.body;
  //Find the user
  const user = await User.findById(req.userAuthId);
  //Check if user has a shipping address
  if (!user?.hasShippingAddress) {
    throw new Error('Please provide a shipping address');
  }
  //Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error('No Order Item');
  }
  //Place/create order -save into dB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });
  console.log(order);

  //update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  //Push order into user
  user.orders.push(order?._id);
  await user.save();

  //make payment(stripe)
  //convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: 'inr',
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
  });
  res.send({ url: session.url });
});

// @desc   get all orders
// @route  Get /api/v1/orders
// @access Private

export const getAllOrders = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find();
  res.json({
    success: true,
    message: 'All orders',
    orders,
  });
});

// @desc   get single orders
// @route  Get /api/v1/orders/:id
// @access Private

export const getOrder = asyncHandler(async (req, res) => {
  //get id from prams
  const id = req.params.id;
  //find order
  const order = await Order.findById(id);
  res.json({
    success: true,
    message: 'Single order',
    order,
  });
});

// @desc   update order to delivered
// @route  Put /api/v1/orders/update/:id
// @access Private

export const updateOrder = asyncHandler(async (req, res) => {
  //get id from prams
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.json({
    success: true,
    message: 'Order updated',
    updatedOrder,
  });
});

// @desc   get sales sum of orders
// @route  Get /api/v1/orders/sales/sum
// @access Private/admin
export const getOrderStats = asyncHandler(async (req, res) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: '$totalPrice',
        },
        totalSales: {
          $sum: '$totalPrice',
        },
        maxSale: {
          $max: '$totalPrice',
        },
        avgSale: {
          $avg: '$totalPrice',
        },
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: '$totalPrice',
        },
      },
    },
  ]);
  //send response
  res.status(200).json({
    success: true,
    message: 'Sum of orders',
    orders,
    saleToday,
  });
});
