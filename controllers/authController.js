const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

const signToken = (user) => {
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const authController = {
  protect: catchAsync(async (req, res, next) => {
    let token;
    if (
      req.header.authorization &&
      req.header.authorization.startsWith('Bearer')
    ) {
      token = req.header.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('Please sign in to access', 401));
    }
    next();
  }),
  signup: catchAsync(async (req, res, next) => {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(user);
    res.status(201).json({
      status: 'success',
      token: token,
      data: user,
    });
  }),
  login: catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 404));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.verifyPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 404));
    }

    const token = signToken(user);

    res.status(200).json({
      status: 'success',
      data: token,
    });
  }),
};

module.exports = authController;
