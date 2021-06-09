const express = require('express');
const userController = require('../controllers/userController')

const Router = express.Router();
Router.route('/').get(userController.getUsersHandler).post(userController.postUserHandler);

Router.route('/:id')
  .get(userController.getUserHandler)
  .patch(userController.updateUserHandler)
  .delete(userController.deleteUserHandler);

module.exports = Router;

