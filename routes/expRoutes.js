const express = require('express');
const expController = require('../controllers/expController');
const authController = require('../controllers/authController');

const Router = express.Router();

// Router.param('id', expController.checkID);
//top adventures under $500
Router.route('/top-5-cheap').get(
  expController.topCheapExperiences,
  expController.getHandler
);

Router.route('/top-20-rated').get(
  expController.topRatedExperiences,
  expController.getHandler
);

Router.route('/')
  .get(authController.protect, expController.getHandler)
  .post(expController.postHandler);

Router.route('/:id')
  .get(expController.getOneHandler)
  .patch(expController.updateHandler)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    expController.deleteHandler
  );

module.exports = Router;
