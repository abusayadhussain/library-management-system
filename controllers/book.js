
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
  
  return res.json(req.book);
};

exports.create = (req, res) => {
  const book = new Book(req.body);
  book.save((err, book) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    
    res.json({ book });
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
    res.json({
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
    res.json(data);
  });
};



exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;

  Book.find()
    .populate("author")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, books) => {
      if (err) {
        return res.status(400).json({
          error: "No Books found!",
        });
      }
      res.json(books);
    });
};

/**
 * will return the product based on the category it related to
 */

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;

  Book.find({
    _id: { $ne: req.book },
    author: req.book.author,
  })
    .populate("author", "_id, name")
    .limit(limit)
    .exec((err, books) => {
      if (err) {
        return res.status(400).json({
          error: "No Books found!",
        });
      }
      res.json(books);
    });
};

exports.listAuthors = (req, res) => {
  Book.distinct("author", {}, (err, authors) => {
    if (err) {
      return res.status(400).json({
        error: "No Authors found!",
      });
    }
    res.json(authors);
  });
};



exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "title") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Book.find(findArgs)
    .populate("author")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Books not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};


exports.listSearch = (req, res) => {
  // create query object to hold author and search value
  const query = {};
  // assign search value to query.name
  if(req.query.search){
    query.name = {$regex: req.query.search, $options: 'i'}
    //assign author value to query.author
    if(req.query.author && req.query.author != 'All'){
      query.author = req.query.auhtor
    }
    //find the book based on query object with 2 properties
    //search & author
    Book.find(query,(err,books)=>{
      if(err){
        return res.status(400).json({
          error: errorHandler(err)
        })
      }
      res.json(books)
    })
  }
}
