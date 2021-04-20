const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const loan = new mongoose.Schema({
  book: {
    type:  ObjectId,
    ref: "Book",
    required: true,
  },
  user: {
    type:  ObjectId,
    ref: "User",
    required: true,
  },
  quantity: {
      type: Number,
      default: 1
  },
  isActive: {
    type: Boolean,
    default: false
},
isReturned: {
  type: Boolean,
  default: false
}
}, {
  timestamps: true,
});

module.exports = mongoose.model('Loan', loan);