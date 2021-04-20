const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const { ObjectId } = mongoose.Schema;

const bookSchema = new mongoose.Schema({
   title : String,
   ISBN : String,
   stock : Number,
   author: {
    type: ObjectId,
    ref: "Author",
    required: true,
  },
   description : String, 
});

bookSchema.plugin(mongoosePaginate);

module.exports =  mongoose.model("Book", bookSchema);