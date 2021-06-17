const User = require("../models/userModel");
const catchAsync = require("../Utils/catchAsync");

const userController =  {
     getUsersHandler: catchAsync(async (req, res) => {
      const usersAll = await User.find();

      res.status(200).json({
        status: 'success',
        requestedAt: req.requestedTime,
        results: usersAll.length,
        data: usersAll,
      });

      }),
      
       postUserHandler (req, res) {},
      
       getUserHandler  (req, res) {},
      
       updateUserHandler(req, res){},
      
       deleteUserHandler (req, res) {},
}

module.exports = userController;