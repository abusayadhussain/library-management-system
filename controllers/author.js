const Author = require("../models/author");
const { errorHandler } = require("../helpers/dbErrorHandler");

/*
** find the author by ID for route params. it's an middleware
*/
exports.authorById = (req, res, next, id) => {
  //find the book  by id
  Author.findById(id).exec((err, author) => {
    if (err || !author) {
      return res.status(400).json({
        error: "Author not found",
      });
    }
    req.author = author;

    //if book found go to the next
    next();
  });
};

/*
** read a single book
*/
exports.read = (req, res) => {
  return res.status(200).json({
    message: "Author found with the given id",
    statusCode: res.statusCode,  
    data: req.author
  });
};

/*
** creating book
*/
exports.create = (req, res) => {
  //creating book object to save it to the database
  let author = new Author(req.body);
  //saving the book to the database
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

/*
** update book by id
*/
exports.update = (req, res) => {
  //getting the books from param
  let author = req.author;
  author.name = req.body.name;
  author.nationality = req.body.nationality;
  author.rating = req.body.rating;
  //saving the updated book
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

/*
** removing book
*/
exports.remove = (req, res) => {
  //get the book from params
  let author = req.author;
  //remove the book from database
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

/*
** get list of books from database
*/
exports.list = (req, res) => {
  //options for pagination
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let sort = req.query.sort;
  
  let options = {
    page: page,
    limit: limit,
    sort: sort
  };

  //find all the books from database
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
