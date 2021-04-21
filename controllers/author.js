const Author = require("../models/author");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.authorById = (req, res, next, id) => {
  Author.findById(id).exec((err, author) => {
    if (err || !author) {
      return res.status(400).json({
        error: "Author not found",
      });
    }
    req.author = author;
    next();
  });
};

exports.read = (req, res) => {
  return res.status(200).json({
    message: "Author found with the given id",
    statusCode: res.statusCode,  
    data: req.author
  });
};

exports.create = (req, res) => {
  let author = new Author(req.body);
  author.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.status(201).json({
      message: "Author created successfully",
      statusCode: res.statusCode,  
      data,
    });
  });
};

exports.update = (req, res) => {
  let author = req.author;
  author.name = req.body.name;
  author.nationality = req.body.nationality;
  author.rating = req.body.rating;
  author.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.status(200).json({
      message: "Author updated successfully",
      statusCode: res.statusCode,   
      data
    });
  });
};

exports.remove = (req, res) => {
  let author = req.author;
  author.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.status(200).json({
      message: "Author deletion successful",
    });
  });
};

exports.list = (req, res) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let sort = req.query.sort;
  
  let options = {
    page: page,
    limit: limit,
    sort: sort
  };

  Author.paginate({},options,(err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.status(200).json({
      message: "List of all Authors",
      statusCode: res.statusCode,   
      data
    });
  });
};
