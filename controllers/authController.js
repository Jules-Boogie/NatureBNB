const User = require("../models/userModel");
const catchAsync = require("../Utils/catchAsync");

const authController = {
    signup: catchAsync(async(req,res,next)=> {
        const user = await User.create(req.body);
        res.status(201).json({
           status:"success" ,
           data: user
        })
    }),
}

module.exports = authController;