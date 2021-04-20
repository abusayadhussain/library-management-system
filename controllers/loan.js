const Book = require("../models/book");
const Loan = require("../models/loan");
const User = require("../models/user");
const xl = require('excel4node');
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.loanById = (req, res, next, id) => {
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

exports.read = (req, res) => {
  let loan = req.loan;
  if(loan.isActive === false){
    return res.json({
        message: "Loan is not issued yet",
        data: loan
    });
  }
  return res.json({
    message: "Loan issued successfully",
    data: loan
});
};


exports.create = (req, res) => {
    Book.findById(req.body.book).exec((err,book)=>{
        if(err || !book){
            return res.status(400).json({
                error: "Book not found!",
              });
        }
        if(book.stock < 1){
            return res.status(400).json({
                error: "Out of stock",
              });
        }
        const loan = new Loan({
            book: req.body.book,
            user: req.params.userId,
            quantity: req.body.quantity
        });
        
        loan.save((err, loan) => {
          if (err) return res.status(400).json({ error: errorHandler(err) });
         
          res.json({message: "Loan request accepted and waiting for Admin to approve!",
                    data: loan});
        });
    })
  
};

exports.remove = (req, res) => {
  let loan = req.loan;
  loan.remove((err, deletedLoan) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Loan deletion successful",
    });
  });
};

exports.update = (req, res) => {
    Book.findById(req.body.book).exec((err,book)=>{
        if(err || !book){
            return res.status(400).json({
                error: "Book not found!",
              });
        }
        if(book.stock < 1){
            return res.status(400).json({
                error: "Out of stock",
              });
        }
        let loan = req.loan;
  loan.book = req.body.book;
  loan.quantity = req.body.quantity;
  loan.isActive = req.body.isActive;
  loan.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    book.stock -= loan.quantity;
    if(book.stock >= 0){
    book.save((err, book) => {
        if(err){
          return res.status(400).json({
              error: "Something wrong happen",
            }); 
        } 
    })
  }
    res.json(data);
  });
  
});

}

exports.returnLoan = (req, res) => {
    Loan.findById(req.params.loanId).exec((err, loan)=>{
        if(err || !loan){
            return res.status(400).json({
                error: 'Loan not found!'
              });
        }
       
        if(loan.book == req.body.book && loan.isActive==true){
              loan.isReturned = true;
              loan.save((err, loan) => {
                if(err){
                  return res.status(400).json({
                      error: "No such book borrowed",
                    }); 
                } 
                res.json({message:"Book return request recieved and waiting for admin to approve!",
                          data:loan }); 
            })
          }
           else{
             res.status(400).json({message: "You haven't borrow this book"})
           }
        })
       
        
}

exports.verifyLoan = (req,res) => {
  Loan.findById(req.params.loanId).exec((err, loan)=>{
    if(err || !loan){
        return res.status(400).json({
            error: 'Loan not found!'
          });
    }
    Book.findById(loan.book).exec((err, book) => {
      if(err || !book){
          return res.status(400).json({
              error: 'Book not found!'
            });
      }
      console.log(loan.isReturned);
      if(loan.isReturned === true){
      book.stock += loan.quantity;
      if(book.stock >= 0){
          book.save((err, book) => {
              if(err){
                return res.status(400).json({
                    error: "Something wrong happen",
                  }); 
              } 
          })

      loan.remove((err, deletedLoan) => {
          if (err) {
              return res.status(400).json({
              error: errorHandler(err),
            });
          }
            res.json({
                message: "Loan deleted and book returned to Library successfully!",
              });
            }); 
        }
      }

    
    })
    

  })
}




exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;

  Loan.find()
    .populate('book')
    .populate('user','-photo')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, loans) => {
      if (err) {
        return res.status(400).json({
          error: "No Loans found!",
        });
      }
      res.json(loans);
    });
};

exports.genrateExcel =  (req, res) => {
    Loan.find( async (err, loans)=>{
        if (err) {
            return res.status(400).json({
              error: "No Loans found!",
            });
          }
          var wb = new xl.Workbook();
          var ws = wb.addWorksheet('Loan Data');
          var style = wb.createStyle({
             font: {
                color: '#000000',
                size: 9,
             }
          });
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
      
     
    wb.write('LoanData.xlsx', (err,result)=>{
      if(err){
        res.status(500).json({message: 'Couldnot generate LoanData excel sheet'});
      }
      res.json({message:"Successfully excel sheet for LoanData generated",
                data: result});
    });

    })
}

