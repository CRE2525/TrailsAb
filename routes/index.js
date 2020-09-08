//Route file for main page, log in, register, and log out route.  [Done]

//Setting up requirements
const express  = require("express"),
      router   = express.Router(),
      passport = require("passport"),
      User     = require("../models/user");

//Route for landing page
router.get("/", function(req, res){
	res.render("trails/landing");
});

//Route for about page
router.get("/about", function(req, res){
	res.render("about");
});

//Route for rendering register form
router.get("/register", function(req, res){
	res.render("register");
});

//Register route, creates new user in DB
router.post("/register", function(req, res){
	let newUser = new User({username: req.body.username});
	if(req.body.username === 'Admin'){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome, " + user.username + "!");
			res.redirect("/trails");
		});
	});
});

//Log in route, renders log in page
router.get("/login", function(req, res){
	res.render("login");
});

//Log in post route
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/trails",
		failureRedirect: "/login"
	}), function(req, res){
});

//Log out route, redirects to main Trail page
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You have been logged out.");
	res.redirect("/trails");
});

//Export routes
module.exports = router;