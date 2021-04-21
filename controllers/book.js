
const Book = require("../models/book");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.bookById = (req, res, next, id) => {
  Book.findById(id)
  .populate('author')
  .exec((err, book) => {
    if (err || !book) {
      return res.status(400).json({
        error: "Book not found!",
      });
    }
    req.book = book;
    next();
  });
};

exports.read = (req, res) => {
  
  return res.status(200).json({
    message: "Book found with the given id",
    statusCode: res.statusCode, 
    data: req.book
  });
};

exports.create = (req, res) => {
  const book = new Book(req.body);
  book.save((err, book) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    
    res.status(201).json({
      message: "Book created successfully",
      statusCode: res.statusCode, 
      data: book
     });
  });
};

exports.remove = (req, res) => {
  let book = req.book;
  book.remove((err, deletedBook) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.status(200).json({
      message: "Book deletion successful",
    });
  });
};

exports.update = (req, res) => {
  let book = req.book;
  book.title = req.body.title;
  book.ISBN = req.body.ISBN;
  book.stock = req.body.stock;
  book.author = req.body.author;
  book.description = req.body.description;
  book.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.status(200).json({
      message: "Book updated successfully",
      statusCode: res.statusCode,
      data
    });
  });
};



exports.list = (req, res) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let sort = req.query.sort;

  let options = {
    populate: 'author',
    page: page,
    limit: limit,
    sort: sort
  };

  Book.paginate({},options,(err, books) => {
      if (err) {
        return res.status(400).json({
          error: "No Books found!",
        });
      }
      res.status(200).json({
        message: "List of all Books",
        statusCode: res.statusCode,   
        data: books
      });
    });
};

/**
 * will return the Book based on the Author it related to
 */

exports.listRelated = (req, res) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let sort = req.query.sort;

  let options = {
    populate: 'author',
    page: page,
    limit: limit,
    sort: sort
  };

  Book.paginate({
    _id: { $ne: req.book },
    author: req.book.author,
  },options,(err, books) => {
      if (err) {
        return res.status(400).json({
          error: "No Books found!",
        });
      }
      res.status(200).json({
        message: "List of all Authors",
        statusCode: res.statusCode,   
        data: books
      });
    });
};

exports.listAuthors = (req, res) => {
  Book.distinct("author", {}, (err, authors) => {
    if (err) {
      return res.status(400).json({
        error: "No Authors found!",
      });
    }
    res.status(200).json({
      message: "List of all Authors",
      statusCode: res.statusCode,
      data: authors
    });
  });
};



exports.listSearch = (req, res) => {
  // create query object to hold author and search value
  const query = {};
  // assign search value to query.name
  if(req.query.search){
    query.title = {$regex: req.query.search, $options: 'i'}
    //assign author value to query.author
    if(req.query.author && req.query.author != 'All'){
      query.author = req.query.auhtor
    }
    //find the book based on query object with 2 properties
    //search & author
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let sort = req.query.sort;
  
  let options = {
    populate: 'author',
    page: page,
    limit: limit,
    sort: sort
  };

  Book.paginate(query, options,(err,books)=>{
    if(err){
      return res.status(400).json({
        error: errorHandler(err)
          })
    }
      res.status(200).json({
        message: "Search result of the books",
        statusCode: res.statusCode,
        data: books
      })
    })
  }
}
