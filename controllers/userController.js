const userController =  {
     getUsersHandler (req, res)  {
        res.status(500).json({
          status: 'error',
        });
      },
      
       postUserHandler (req, res) {},
      
       getUserHandler  (req, res) {},
      
       updateUserHandler(req, res){},
      
       deleteUserHandler (req, res) {},
}

module.exports = userController;