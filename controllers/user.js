const User = require("../models/user");

/*
**find the book by ID for route params. it's an middleware
*/
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !User) {
      res.status(400).json({
        error: "User not found",
      });
    }
    //saving the user to req.profile
    req.profile = user;
    next();
  });
};

/*
** read a single book
*/
exports.read = (req, res) => {
  //removing salt and hashed password from user to show in response
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.status(200).json({
    message: "User profile",
    statusCode: res.statusCode,
    data:req.profile
  });
};
/*
** update book by id
*/
exports.update = (req, res) => {
  //updating the user
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      //checking is there any error or not
      if (err) {
        return res.status(400).json({
          error: "Not authorized to perform this task!",
        });
      }
      //removing salt and hashed password from user to show in response
      user.hashed_password = undefined;
      user.salt = undefined;
      res.status(200).json({
        message: "Profile updated successfully",
        statusCode: res.statusCode,  
        data:user
      });
    }
  );
};
