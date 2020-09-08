//Middleware file [Done]

//Requirement set up
const Trail = require("../models/trail");
const Comment = require("../models/comment");

const middlewareObj = {
	//Check if trail is owned by currently logged in user
	checkTrailOwnership : function(req, res, next){
		if(req.isAuthenticated()){
			Trail.findById(req.params.id, function(err, found_trail){
				if(err){
					req.flash("error", "Sorry, there was an error.");
					res.redirect("/trails");
				} else {
					if((found_trail.author.id.equals(req.user._id)) || (req.user.isAdmin)){
						next();
					} else {
						req.flash("error", "You do not have permission to do that.");
						res.redirect("back");
					}
				}
			});
		} else {
			req.flash("error", "Please register or sign in first.");
			res.redirect("back");
		}
	},

	//Check if comment is owned by currently logged in user
	checkCommentOwnership : function(req, res, next){
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					req.flash("error", "Sorry, there was an error.");
					res.redirect("back");
				} else {
					if((foundComment.author.id.equals(req.user._id)) || (req.user.isAdmin)) {
						next();
					} else {
						req.flash("error", "You do not have permission to do that.");
						res.redirect("back");
					}
				}
			});
    	} else {
			req.flash("error", "Please register or sign in first.");
        	res.redirect("back");
    	}
	},
	
	//Check if the user is logged in or not
	isLoggedIn : function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("error", "Please register or sign in first.");
		res.redirect("/login");
	},
	
	//Check if Trail ID of request is a valid ID
	checkTrailId : function(req, res, next){
		Trail.findById(req.params.id, function(err, trail){
			if(err || !trail){
				req.flash("error", "Error: Trail not found.");
				res.redirect("back");
			} else {
				res.locals.foundTrail = trail;
				next();
			}
    	});
	}
}

module.exports = middlewareObj;