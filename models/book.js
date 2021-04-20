const mongoose = require("mongoose");
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

module.exports =  mongoose.model("Book", bookSchema);