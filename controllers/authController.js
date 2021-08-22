const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');
const sendEmail = require('../Utils/email');

const signToken = (user) => {
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const cookieOptions = {
  expires: new Date(
    Date.now + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 50 * 100
  ),
  secure: false, // only send over https
  httpOnly: true, //prevent cross site scripting attack
};

const createSendToken = (user, statuscode, res) => {
  const token = signToken(user);

  // send cookie to client
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined // remove password from output
  res.status(statuscode).json({
    status: 'success',
    token: token,
    data: {user},
  });
};

const authController = {
  protect: catchAsync(async (req, res, next) => {
    // get token
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

    // verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user stil exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(new AppError('User no longer exists'), 401);
    }

    // check if user changed password
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please login again', 401)
      );
    }
    //grant access to protected route
    req.user = freshUser;
    next();
  }),
  signup: catchAsync(async (req, res, next) => {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    createSendToken(user, 201, res);
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
    createSendToken(user, 200, res);
  }),
  restrictTo: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform action', 403)
        );
      }
      next();
    };
  },
  forgotPassword: catchAsync(async (req, res, next) => {
    // get user with email
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('User does not exist', 404));
    }
    // create token
    const resetToken = user.resetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // send email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/resetpassword/${resetToken}`;
    const message = `change password with this link ${resetURL}`;
    try {
      await sendEmail({
        email: req.body.email,
        subject: 'change password email (valid for 10mins)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent via email',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
    }
  }),

  resetPassword: catchAsync(async (req, res, next) => {
    // get user by token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // if token has not expired, set new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save();
    createSendToken(user, 200, res);
  }),
  updatePassword: catchAsync(async (req, res, next) => {
    // get user
    const user = await User.findOne({ email: req.body.email });
    if (
      !user ||
      !(await user.verifyPassword(req.body.passwordConfirm, user.password))
    ) {
      return next(new AppError('Incorrect email or password', 404));
    }
    // update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user, 200, res);
  }),
};

module.exports = authController;
