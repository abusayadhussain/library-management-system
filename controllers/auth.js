const User = require("../models/user");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const jwt = require("jsonwebtoken"); // to generate auth token
const expressJwt = require("express-jwt"); // for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");

 

exports.signup = (req, res) => {
  console.log(req.file);
  const user = new User({
    name:req.body.name,
    email: req.body.email,
    password: req.body.password,
    profileImage: req.file.path,
  });
  user.save((err, user) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    user.salt = undefined;
    user.hashed_password = undefined;
    res.status(201).json({ 
      message:"user successfully signed up",
      statusCode: res.statusCode, 
      user 
    });
  });
  
};

exports.signin = (req, res) => {
  //find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with given email does not exist. Please signup",
      });
    }
    //if user is found email and password should match
    //authenticate the user
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Password did not match please login again",
      });
    }

    const privateKEY = process.env.PRIVATE_KEY
      .replace(/\\n/g, '\n');
    // generate signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, privateKEY, {expiresIn: '2h', algorithm: 'RS256'});
    //return response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.status(200).json({
      message: "Sign in Successfull",
      statusCode: res.statusCode,
      token,
      user: { _id, name, email, role },
    });
  });
};



exports.requireSignIn = expressJwt({
  secret: process.env.PUBLIC_KEY
  .replace(/\\n/g, '\n'),
  algorithms: ["RS256"],
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "For Admin only! Access denied",
    });
  }
  next();
};
