const expModel = require('../models/expModel');
const APIFeatures = require('../Utils/apiFeatures');
const catchAsync = require('../Utils/catchAsync');
const AppError = require("../Utils/appError");


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
  
  getHandler: catchAsync(async(req, res,next) => {
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

  })
  ,
  getOneHandler: catchAsync(async (req, res) =>{

      const exp = await expModel.findById(req.params.id);
      if(!exp){
        return next(new AppError("No tour with that ID found",404))
      }
      res.status(200).json({
        status: 'success',
        requestedAt: req.requestedTime,
        results: 1,
        data: exp,
      });
    }
  ),

  postHandler: catchAsync(async (req, res,next)=> {
      const newExp = await expModel.create(req.body);
      res.status(201).json({
        status: 'created',
        results: newExp.length,
        data: { newExp },
      });
  }),

  updateHandler: catchAsync(async (req, res, next)=> {
      const exp = await expModel.findByIdAndUpdate(req.param.id, req.body, {
        new: true,
        runValidators: true,
      });
      if(!exp){
        return next(new AppError("No tour with that ID found",404))
      }
      res.status(201).json({
        status: 'success',
        data: {
          exp,
        },
      });
  }),

  deleteHandler: catchAsync(async (req, res,next)=>{

      const exp = await expModel.findOneAndDelete({ _id: req.params.id });
      if(!exp){
        return next(new AppError("No tour with that ID found",404))
      }
      res.status(204).json({
        status: 'no response',
        data: null,
      });

  }
),
}

module.exports = expController;
