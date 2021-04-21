const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const { ObjectId } = mongoose.Schema;

const bookSchema = new mongoose.Schema({
   title : {
     type: String,
     required: true,
   },
   ISBN :{ 
     type: String,
     required: true,
     unique: true
   },
   stock : {
      type: Number,
      required: true,
   },
   author: {
    type: ObjectId,
    ref: "Author",
    required: true,
  },
   description : {
      type: String,
   } 
});

bookSchema.plugin(mongoosePaginate);

module.exports =  mongoose.model("Book", bookSchema);