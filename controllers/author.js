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
  return res.json(req.author);
};

exports.create = (req, res) => {
  let author = new Author(req.body);
  author.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
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
    res.json(data);
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
    res.json({
      message: "Author deleted",
    });
  });
};

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  Author.find()
  .sort([[sortBy, order]])
  .limit(limit)
  .exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({data});
  });
};
