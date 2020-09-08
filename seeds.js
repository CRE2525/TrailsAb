//Seed DB file. [Done]

//Setting up requirements
const mongoose   = require("mongoose"),
 	  Trail      = require("./models/trail"),
 	  Comment    = require("./models/comment");
 
//Setting up trails
const data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
		location: "Mars",
		rating: "3",
		distance: "15",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Desert Mesa",
		price: "0",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
		location: "Earth",
		rating: "1",
		distance: "51",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff71",
            username: "Jill"
        }
    },
    {
        name: "Canyon Floor", 
		price: "",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
		location: "Venus",
		rating: "4",
		distance: "5",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff77",
            username: "Jane"
        }
    }
]
 
//Seeding data base with function
function seedDB(){
   //Remove all current trails in DB
   Trail.deleteMany({}, function(err){
        if (err){
            console.log(err);
        }
        console.log("removed trails!");
	   //Remove all current comments in DB
        Comment.deleteMany({}, function(err) {
            if (err){
                console.log(err);
            }
            console.log("removed comments!");
            //add trails to DB
            data.forEach(function(seed){
                Trail.create(seed, function(err, trail){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a trail");
                        //Add comments to DB
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author:{
                                    id : "588c2e092403d111454fff76",
                                    username: "Jack"
                                }
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    trail.comments.push(comment);
                                    trail.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        })
    }); 
}
//Why are there so many callbacks? -> because the delete comments part would run after populating the db. Thus you need to force it to go in the above order

//Export seedDB() function
module.exports = seedDB;