
const Book = require("../models/book");
const { errorHandler } = require("../helpers/dbErrorHandler");
/*
**find the book by ID for route params. it's an middleware
*/
exports.bookById = (req, res, next, id) => {
  //find the book  by id and populate the author associates with it
  Book.findById(id)
  .populate('author')
  .exec((err, book) => {
    if (err || !book) {
      return res.status(400).json({
        error: "Book not found!",
      });
    }
    //saving the book to req.book
    req.book = book;

    //if book found go to the next
    next();
  });
};

/*
** read a single book
*/
exports.read = (req, res) => {
  return res.status(200).json({
    message: "Book found with the given id",
    statusCode: res.statusCode, 
    data: req.book
  });
};

/*
** creating book
*/
exports.create = (req, res) => {
  //creating book object to save it to the database
  const book = new Book(req.body);
  //saving the book to the database
  book.save((err, book) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    
    res.status(201).json({
      message: "Book created successfully",
      statusCode: res.statusCode, 
      data: book
     });
  });
};

/*
** removing book
*/
exports.remove = (req, res) => {
  //get the book from params
  let book = req.book;
  //remove the book from database
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

/*
** update book by id
*/
exports.update = (req, res) => {
  //getting the book from params
  let book = req.book;
  book.title = req.body.title;
  book.ISBN = req.body.ISBN;
  book.stock = req.body.stock;
  book.author = req.body.author;
  book.description = req.body.description;
  //saving the updated book
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

/*
** get list of books from database
*/
exports.list = (req, res) => {
  //options for pagination
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let sort = req.query.sort;

  let options = {
    populate: 'author',
    page: page,
    limit: limit,
    sort: sort
  };
  //find all the books from database
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
  //options for pagination
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let sort = req.query.sort;

  let options = {
    populate: 'author',
    page: page,
    limit: limit,
    sort: sort
  };
  //fetching the related books from same author
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

/*
** return the list of all authors book
*/
exports.listAuthors = (req, res) => {
  //list of authors avaiable from database
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


/*
** search books by title and author
*/
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
    //options for pagination 
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let sort = req.query.sort;
  
  let options = {
    populate: 'author',
    page: page,
    limit: limit,
    sort: sort
  };
  //find the book based on query object with 2 properties
  //search & author
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
