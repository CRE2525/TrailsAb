//Comment routes file [Done]

//Setting up requirements
const express    = require("express"),
      router     = express.Router({mergeParams: true}),
      Trail = require("../models/trail"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");

//New comment route, renders new comment form at /trails/<trail ID>/commments/new
router.get("/new", middleware.isLoggedIn, middleware.checkTrailId, function(req, res){
	Trail.findById(req.params.id, function(err, trail){
		if(err) {
			req.flash("error", "Sorry, something went wrong.");
			console.log(err);
		} else {
			res.render("comments/new", {trail: trail});	
		}
	});
});

//New comment route, creates new comment at /trails/<trail ID>
router.post("/", middleware.isLoggedIn, middleware.checkTrailId, function(req, res){
	Trail.findById(req.params.id, function(err, trail){
		if(err){
			req.flash("error", "Sorry, something went wrong.");
			console.log(err);
			res.redirect("/trails");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err) {
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					trail.comments.push(comment);
					trail.save();
					req.flash("success", "Comment created.");
					res.redirect("/trails/" + trail._id);
				}
			});
		}
	});
});

//Edit comment route, renders edit comment form at /trails/<trail ID>/commments/edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", "Sorry, something went wrong.");
			res.redirect("back");
		} else {
			res.render("comments/edit", {trail_id: req.params.id, comment: foundComment});
		}
	}) 
});

//Edit comment route, updates comment at /trails/<trail ID>
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated_comment){
		if(err){
			req.flash("error", "Sorry, something went wrong.");
			res.redirect("back");
		} else {
			res.redirect("/trails/" + req.params.id);
		}
	});
});


//Delete comment route, removes commet from DB
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "Sorry, something went wrong.");
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted.");
			res.redirect("/trails/" + req.params.id);
		}
	});
});

//exports comment routes
module.exports = router;