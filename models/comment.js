//Mongo model for comments [Done]
const mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

//exporting model
module.exports = mongoose.model("Comment", commentSchema);