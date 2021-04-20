const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const author = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  nationality: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Author', author);