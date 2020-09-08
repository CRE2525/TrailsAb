//trail routes file [Done]

//Setting up requirements
const express    = require("express"),
      router     = express.Router(),
      trail = require("../models/trail"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware"),
	  multer     = require("multer"),
	  cloudinary = require('cloudinary');

//Image upload set up
let storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
let imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed.'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter})

//Cloudinary set up
cloudinary.config({ 
  cloud_name: 'cre2525', 
  api_key: "<key>", 
  api_secret: "<password>"
});
 
//Root trail route, renders index page at /trails
router.get("/", function(req, res){
	trail.find({}, function(err, all_trails){
		if(err){
			console.log("error. watch out");
			console.log(err);
		} else {
			res.render("trails/index", {trail_data: all_trails});
		}
	});
});

//Root route, posts trails to index page at /trails
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      // add cloudinary url for the image to the trail object under image property
      req.body.trail.image = result.secure_url;
      // add image's public_id to trail object
      req.body.trail.imageId = result.public_id;
      // add author to trail
      req.body.trail.author = {
        id: req.user._id,
        username: req.user.username
      }
      trail.create(req.body.trail, function(err, trail) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/trails/' + trail.id);
      });
    });
});

//New route, renders create trail page at /camgrounds/new
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("trails/new");
});

//Show route, renders specific trail show page at /camgrounds/<trail ID>
router.get("/:id", function(req, res){
	trail.findById(req.params.id).populate("comments").exec(function(err, found_trail){
		if(err){
 			console.log("error. watch out");
 			console.log(err);
		} else {
 			res.render("trails/show", {trail: found_trail});
		}
	});
});

//Edit route, renders trail editor page at /camgrounds/<trail ID>/edit
router.get("/:id/edit", middleware.checkTrailOwnership, function(req, res){
	trail.findById(req.params.id, function(err, found_trail){
		if(err){
			console.log(err);
		} else {
			res.render("trails/edit", {trail: found_trail});
		}
	});
});

//Edit route, updates specific trail at /camgrounds/<trail ID>
router.put("/:id", upload.single('image'), function(req, res){
    trail.findById(req.params.id, async function(err, trail){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(trail.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  trail.imageId = result.public_id;
                  trail.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            trail.name = req.body.name;
            trail.desc = req.body.desc;
			trail.location = req.body.location;
			trail.rating = req.body.rating;
			trail.distance = req.body.distance;
            trail.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/trails/" + trail._id);
        }
    });
});

router.delete('/:id', function(req, res) {
  trail.findById(req.params.id, async function(err, trail) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(trail.imageId);
        trail.remove();
        req.flash('success', 'trail deleted successfully!');
        res.redirect('/trails');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});

//export routes
module.exports = router;