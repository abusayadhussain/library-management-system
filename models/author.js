const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
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

authorSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Author', authorSchema);