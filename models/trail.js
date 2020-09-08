//Mongo model for trails [Done]
const mongoose = require("mongoose");

let trailSchema = new mongoose.Schema({
	name: String,
    image: String,
    imageId: String,
    desc: String,
	rating: String,
	location: String,
	distance: String,
    author: {
       id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       },
       username: String
    },
    comments: [
       {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
       }
    ]
});

//exporting model
module.exports = mongoose.model("Trail", trailSchema);