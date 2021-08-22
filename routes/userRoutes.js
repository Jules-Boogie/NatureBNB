const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


const Router = express.Router();

Router.post('/signup', authController.signup);
Router.post('/login', authController.login);
Router.post('/forgotpassword', authController.forgotPassword);
Router.patch('/resetpassword/:token', authController.resetPassword);
Router.patch(
  '/updatemypassword',
  authController.protect,
  authController.updatePassword
);
Router.patch(
  '/updateme',
  authController.protect,
  userController.updateMe
);
Router.delete(
  '/deleteme',
  authController.protect,
  userController.deleteMe
);

Router.route('/')
  .get(userController.getUsersHandler)
  .post(userController.postUserHandler);

Router.route('/:id')
  .get(userController.getUserHandler)
  // .patch(userController.updateUserHandler)
  // .delete(userController.deleteUserHandler);

module.exports = Router;
