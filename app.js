//Requirments set up [Done]
require('dotenv').config();

const express 	     = require("express"),
      app 			 = express(),
      body_parser 	 = require("body-parser"),
      mongoose 		 = require("mongoose"),
      Trail      	 = require("./models/trail"),
      Comment 		 = require("./models/comment"),
      User 			 = require("./models/user"),
      seedDB         = require("./seeds"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      flash          = require("connect-flash")

//Route files set up
const commentRoutes = require("./routes/comments"),
	  trailRoutes   = require("./routes/trails"),
	  indexRoutes   = require("./routes/index");

//Enviroment variable set up
const url = process.env.DATABASEURL || "mongodb://localhost:27017/Yelp_camp";

//MongoDB Atlas connection and set up
mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(error => {
	console.log('ERROR:', error.message);
});

//=============== Back up MongoDB Atlas connection ==============

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://CRE2525:<password>cluster0.spgoi.mongodb.net/<db_name>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection objects
//   client.close();
// });

//===============================================================

//Miscellaneous set up
app.use(body_parser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
//seedDB(); //Seed database, can be found in seeds.js file

app.use(require("express-session")({
	secret: "<secret>",
	resave: false,
	saveUninitialized: false
}));

//Passport.js set up and configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.current_user = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Route set up
app.use(indexRoutes);
app.use("/trails", trailRoutes);
app.use("/trails/:id/comments", commentRoutes);

//Server set up
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});;