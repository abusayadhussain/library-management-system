const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { ObjectId } = mongoose.Schema;

const loanSchema = new mongoose.Schema({
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

loanSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Loan', loanSchema);