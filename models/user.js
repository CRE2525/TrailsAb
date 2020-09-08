//Mongo model for users [Done]
const mongoose = require("mongoose");
const passportLocalMongose = require("passport-local-mongoose");

let UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongose);


//exporting model
module.exports = mongoose.model("User", UserSchema);