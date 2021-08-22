const User = require("../models/userModel");
const catchAsync = require("../Utils/catchAsync");
const AppError = require('../Utils/appError');

const filterBody = (obj, ...params)=> {
  const newObj = {}
  for (let key of Object.keys(obj)){
    if(params.includes(key)) newObj[key] = obj[key]
  }
  return newObj
}

const userController =  {
     getUsers: catchAsync(async (req, res) => {
      const usersAll = await User.find();

      res.status(200).json({
        status: 'success',
        requestedAt: req.requestedTime,
        results: usersAll.length,
        data: usersAll,
      });

      }),
      updateMe: catchAsync(async(req, res,next)=>
      {
        // create error if user posts password data
        if(req.body.password || req.body.passwordConfirm){
          return next(new AppError("can't update password here please use",400))
        }

        // filter out unwanted field names
        const filteredBody = filterBody(req.body,'name','email')
        const updatedUser = User.findByIdAndUpdate(req.user.id, filteredBody, {new:true,runValidators:true} )
        
        //send response
        res.status(200).json({
          status:'success',
          data:{
            user:updatedUser
          }
        })
      }),
      deleteMe: catchAsync(async(req, res, next) => {
        const deletedUser = User.findByIdAndUpdate(req.user.id, {active:false});
        res.status(204).json({
          status:"success"
        })
      }),
      
       getUserHandler  (req, res) {},
      
       updateUser: (req, res,next)=>
       {

       },
      
       
}

module.exports = userController;