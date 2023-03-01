import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import { getTokenFromHeader } from '../utils/getTokenFromHeader.js';
import { verifyToken } from '../utils/verifyToken.js';

// @descr  Register user
// @route  Post /api/v1/users/register
// @access Private/Admin

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  //Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    //throw error
    throw new Error('User already exists');
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //create the user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    status: 'success',
    message: 'User Registered Successfully',
    data: user,
  });
});

// @descr  Login user
// @route  Post /api/v1/users/login
// @access Public

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Find the user in db by email only
  const userFound = await User.findOne({
    email,
  });
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: 'success',
      message: 'User logged in successfuly',
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error('Invalid login credentials');
  }
});

// @descr  Get user profile
// @route  GET /api/v1/users/profile
// @access Private

export const getUserProfile = asyncHandler(async (req, res) => {
  const token = getTokenFromHeader(req);
  //verify Token
  const verified = verifyToken(token);
  console.log(verified);
  res.json({
    msg: 'Welcome Profile page',
  });
});
