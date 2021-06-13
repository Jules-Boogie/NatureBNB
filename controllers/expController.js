const expModel = require('../models/expModel');
const APIFeatures = require('../Utils/apiFeatures')


const regions = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Africa & MiddleEast',
  'South America',
];
const interest = ['Culinary', 'Active', 'Cultural', 'Animals', 'Boating'];


const expController = {
  //middlewares
  topCheapExperiences(req, res, next) {
    req.query.limit = '5';
    req.query.price = 'price[lte]=500';
    req.query.sort = '-ratingsAverage';
    req.query.fields =
      'name,price,ratingsAverage,summary,difficulty,imageCover';
    next();
  },
  topRatedExperiences(req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,ratingsQuantity';
    req.query.fields =
      'name,price,ratingsAverage,summary,difficulty,imageCover';
    next();
  },
  
  async getHandler(req, res) {
    try {
      const features = new APIFeatures(expModel.find(),req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

      const expsAll = await features.query;

      res.status(200).json({
        status: 'success',
        requestedAt: req.requestedTime,
        results: expsAll.length,
        data: expsAll,
      });
    } catch (err) {
      res.status(404).json({
        status: 'bad request',
        message: err,
      });
    }
  },

  async getOneHandler(req, res) {
    try {
      const exp = await expModel.findById(req.params.id);
      res.status(200).json({
        status: 'success',
        requestedAt: req.requestedTime,
        results: 1,
        data: exp,
      });
    } catch (err) {
      res.status(404).json({
        status: 'bad request',
        message: err,
      });
    }
  },

  async postHandler(req, res) {
    try {
      const newExp = await expModel.create(req.body);
      res.status(201).json({
        status: 'created',
        results: newExp.length,
        data: { newExp },
      });
    } catch (err) {
      res.status(400).json({
        status: 'Bad request',
        message: err,
      });
    }
  },

  async updateHandler(req, res) {
    try {
      const exp = await expModel.findByIdAndUpdate(req.param.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.status(201).json({
        status: 'success',
        data: {
          exp,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: 'Bad request',
        message: err,
      });
    }
  },

  async deleteHandler(req, res) {
    try {
      await expModel.findOneAndDelete({ _id: req.params.id });
      res.status(204).json({
        status: 'no response',
        data: null,
      });
    } catch (err) {
      res.status(404).json({
        status: 'Bad Request',
        message: err,
      });
    }
  },

};

module.exports = expController;
