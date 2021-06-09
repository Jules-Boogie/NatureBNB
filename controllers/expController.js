const expModel = require('../models/expModel');

// const exps = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/exps-simple.json`)
// );
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
      const exclude = ['sort', 'limit', 'fields', 'page'];
      const queryObj = { ...req.query };
      exclude.forEach((el) => delete queryObj[el]);
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (match) => `$${match}`
      );

      let query = expModel.find(JSON.parse(queryStr));

      if ('sort' in req.query) {
        const sortBy = req.query.sort.split(',').join(' ');
        query.sort(sortBy);
      } else {
        query.sort('-createdAt');
      }

      if ('fields' in req.query) {
        const fieldStr = req.query.fields.split(',').join(' ');
        query.select(fieldStr);
      } else {
        query.select('-__v');
      }

      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 20;
      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);

      if (req.query.page) {
        const documentCount = await expModel.countDocuments();
        if (skip >= documentCount) {
          throw new Error('Page does not exist');
        }
      }
      const expsAll = await query;

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
