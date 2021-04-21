const Book = require("../models/book");
const Loan = require("../models/loan");
const User = require("../models/user");
const xl = require('excel4node');
const { errorHandler } = require("../helpers/dbErrorHandler");

/*
** find the loan by ID for route params. it's an middleware
*/
exports.loanById = (req, res, next, id) => {
  //find the book  by id and populate the book and user associates with it
  Loan.findById(id)
  .populate('book')
  .populate('user','-photo')
  .select("-photo")
  .exec((err, loan) => {
    if (err || !loan) {
      return res.status(400).json({
        error: "Loan not found!",
      });
    }
    req.loan = loan;
    next();
  });
};

/*
** read a single book
*/
exports.read = (req, res) => {
  //getting the loan from params
  let loan = req.loan;

  //checking the loan status is active or not
  if(loan.isActive === false){
    return res.status(200).json({
        message: "Loan is not issued yet",
        statusCode: res.statusCode,
        data: loan
    });
  }
  //if not active it's issued successfully
  res.json({
    message: "Loan issued successfully",
    statusCode: res.statusCode,
    data: loan
});
};

/*
** creating book
*/
exports.create = (req, res) => {
    //find the book from req.body
    Book.findById(req.body.book).exec((err,book)=>{
        //checking if there is any error or not
        if(err || !book){
            return res.status(400).json({
                error: "Book not found!",
              });
        }
        //checking the book stock
        if(book.stock < 1){
            return res.status(400).json({
                error: "Out of stock",
              });
        }
        //creating book object to save it to the database
        const loan = new Loan({
            book: req.body.book,
            user: req.params.userId,
            quantity: req.body.quantity
        });

        //saving the book to the database
        loan.save((err, loan) => {
          //checking if any error occured or not
          if (err) return res.status(400).json({ error: errorHandler(err) });
         
          res.status(201).json({
            message: "Loan request accepted and waiting for Admin to approve!",
            statusCode: res.statusCode,
            data: loan});
        });
    })
  
};

/*
** removing book
*/
exports.remove = (req, res) => {
  //get the loan from params
  let loan = req.loan;
  //remove the book from database
  loan.remove((err, deletedLoan) => {
    //checking if there is any error or not
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.status(200).json({
      message: "Loan deletion successful",
    });
  });
};

/*
** update book by id
*/
exports.update = (req, res) => {
    //finding the book is available or not
    Book.findById(req.body.book).exec((err,book)=>{
      //checking if there is any eror
        if(err || !book){
            return res.status(400).json({
                error: "Book not found!",
              });
        }
        //checking the is in stock or not
        if(book.stock < 1){
            return res.status(400).json({
                error: "Out of stock",
              });
        }

        //getting the loan from params
        let loan = req.loan;
        loan.book = req.body.book;
        loan.quantity = req.body.quantity;
        loan.isActive = req.body.isActive;
        //saving the updated book
        loan.save((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
        });
      }
      //on succesful save book stock is dcreased by loan quantity
      book.stock -= loan.quantity;
      //if book stock is greater than 0 save the stock to database
      if(book.stock >= 0){
      book.save((err, book) => {
          if(err){
           return res.status(400).json({
                error: "Something wrong happen",
              }); 
          } 
      })
    }
      res.status(200).json({
        message: "Book loan approved and updated successfully",
        statusCode: res.statusCode,
        data
      });
  });
  
});

}

/*
** return Book-loan that user boroowed from library 
*/
exports.returnLoan = (req, res) => {
  //find the loan from params
    Loan.findById(req.params.loanId).exec((err, loan)=>{
      //checking is there is any error or not
        if(err || !loan){
            return res.status(400).json({
                error: 'Loan not found!'
              });
        }
        //checking the book that loaned is equal to the return book or not and is it active or not
        if(loan.book == req.body.book && loan.isActive==true){
              //on positive is returned set to true 
              loan.isReturned = true;
              loan.save((err, loan) => {
                //checking if there is any error or not
                if(err){
                  return res.status(400).json({
                      error: "No such book borrowed",
                    }); 
                } 
                res.status(200).json({
                  message:"Book return request recieved and waiting for admin to approve!",
                  statusCode: res.statusCode,
                  data:loan
                 }); 
            })
          }
          //if loaned book and req.body book is not same the book is not borrowed from the library
           else{
             res.status(400).json({message: "You haven't borrow this book"})
           }
        })
       
        
}

/*
** verify the book loan is valid and increasing the stock of the book
*/
exports.verifyLoan = (req,res) => {
  //find the loan from pram
  Loan.findById(req.params.loanId).exec((err, loan)=>{
    //checking if there is any error or loan exist or not by id
    if(err || !loan){
        return res.status(400).json({
            error: 'Loan not found!'
          });
    }
    //find the book from the loaned bookId
    Book.findById(loan.book).exec((err, book) => {
      //checking if there is any or or book found
      if(err || !book){
          return res.status(400).json({
              error: 'Book not found!'
            });
      }
      //checking the book is returned or not
      if(loan.isReturned === true){
        //if the book is returned true increase the stock by loan quantity 
      book.stock += loan.quantity;
      //checking the cook stock is greater than 0 or not
      if(book.stock >= 0){
          //save the book if it's returned
          book.save((err, book) => {
              if(err){
                return res.status(400).json({
                    error: "Something wrong happen",
                  }); 
              } 
          })
      //on succesful book return delete th loan
      loan.remove((err, deletedLoan) => {
        //checking if there is any error or not
          if (err) {
              return res.status(400).json({
              error: errorHandler(err),
            });
          }
            res.status(200).json({
                message: "Loan deleted and book returned to Library successfully!",
              });
            }); 
        }
      }
    })
  })
}

/*
** get list of books from database
*/
exports.list = (req, res) => {
  //options for pagination
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let sort = req.query.sort;

  let options = {
    populate:['book', 'user'],
    page: page,
    limit: limit,
    sort: sort
  };
  //find all the books from database

  Loan.paginate({}, options,(err, loans) => {
      if (err) {
        return res.status(400).json({
          error: "No Loans found!",
        });
      }
      res.status(200).json({
        message: "List of all the loans",
        statusCode: res.statusCode,
        data:loans
      });
    });
};

/*
** generate excel sheet for the loan book
*/
exports.genrateExcel =  (req, res) => {
    //find al the loan from database
    Loan.find( async (err, loans)=>{
      //checking if there is any error or not
        if (err) {
            return res.status(400).json({
              error: "No Loans found!",
            });
          }
          //creating workbook for excellsheet
          var wb = new xl.Workbook();
          var ws = wb.addWorksheet('Book-Loan');
          //style for excel sheet
          var style = wb.createStyle({
             font: {
                color: '#000000',
                size: 9,
             }
          });
          //worksheet cell for showing the loans
       ws.cell(1, 1)
          .string("Book Name")
          .style(style);
       for (a = 0; a < loans.length; a++) {
         await Book.findById(loans[a].book, (err, book) => {
          ws.cell(a + 2, 1)
          .string(book.title)
          .style(style);

         })
         
       }

       ws.cell(1, 2)
          .string("Borrowed User")
          .style(style);
       for (a = 0; a < loans.length; a++) {
         await User.findById(loans[a].user, (err, user) => {
          ws.cell(a + 2, 2)
          .string(user.name)
          .style(style);

         })
         
       }

       ws.cell(1, 3)
       .string("Quantity")
       .style(style);
    for (a = 0; a < loans.length; a++) {
       ws.cell(a + 2, 3)
       .number(loans[a].quantity)
       .style(style);
      }

      ws.cell(1, 4)
      .string("Active Status")
      .style(style);
      for (a = 0; a < loans.length; a++) {
        ws.cell(a + 2, 4)
        .bool(loans[a].isActive)
      .style(style);
    }

    ws.cell(1, 5)
      .string("Return Status")
      .style(style);
      for (a = 0; a < loans.length; a++) {
        ws.cell(a + 2, 5)
        .bool(loans[a].isReturned)
      .style(style);
    }
      
    //write the excel sheet to the destination specfied
    wb.write('./loan-report/Book-Loans.xlsx', (err,result)=>{
      //checking if there is any error or not
      if(err){
        res.status(500).json({message: 'Couldnot generate LoanData excel sheet'});
      }
      res.status(200).json({
        message:"Successfully excel sheet for LoanData generated",
        statusCode: res.statusCode,
        data: result
      });
    });
  })
}

