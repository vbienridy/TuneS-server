const keys = require("../config/keys");
const passport = require("passport");
const followModel = require("../models/follow.model");
const userDao = require("../daos/user.dao");


module.exports = app => {

  app.post("/user/:fid/follow", function(req, res){// fid to be followed by user in session
    if(!req.user){
      res.status(500).send({message: "no user in session"});
    }
    
    //even if user is deleted in db, following does not make bugs
    followModel.collection.insert({follower: req.user._id, followee:req.params.fid})
      .then( data=>res.send({message: "success"}) ).catch(err=>res.send(" follow error"))
  })

  app.delete("/user/:fid/unfollow", function(req, res){// fid to be unfollowed by user in session
    if(!req.user){
      res.status(500).send({message: "no user in session"});
    }

    //even if user is deleted in db, he can still follow
    followModel.collection.deleteOne({follower: req.user._id, followee:req.params.fid})
      .then( data=>res.send({message: "success"}) ).catch(err=>res.send("unfollow error"))
  })

  app.get("/user/:fid/followers", function(req, res){ //get followers by id
    followModel.find({followee: req.params.fid}).populate('follower', {photo:1, _id:1, displayName:1})
      .exec().then( data=>res.json(data) ).catch( err=>res.send("get followers error") )
  })

  app.get("/user/:fid/followees", function(req, res){ //get followees by id
    followModel.find({follower: req.params.fid}).populate('followee', {photo:1, _id:1, displayName:1})
      .exec().then( data=>res.json(data) ).catch( err=>res.send("get followees error") )
  })

  app.get("/user/:fid/checkfollow", function(req, res){
    if(!req.user){
      res.status(500).send({message: "no user in session"});
    }

    followModel.collection.findOne({follower: req.user._id, followee: req.params.fid}).then( data=>res.json( {following: data ? true : false }) ).catch( err=>res.send("check fol error") )

  })   //checkFollowing of fid for user in session

  
  app.get("/session", function(req, res) {
    res.status(200).send(req.user);
  });

  app.get("/login/spotify-auth", function(req, res) {
    res.redirect("/login/spotify-auth2");
  });

  app.get(
    "/login/spotify-auth2",
    passport.authenticate("spotify", {
      scope: ["user-read-email", "user-read-private"]
    }),
    (req, res) => {
    }
  );

  app.get(
    "/login/spotify-auth/callback",
    passport.authenticate("spotify", { failureRedirect: keys.frontend[0] }),
    (req, res) => {
      res.redirect(keys.frontend[0]);
    }
  );

  app.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: keys.frontend[0]
    }),
    (req, res) => {
      res.status(200).send(req.user);
    }
  );

  app.post("/register", (req, res) => {
    userDao.register(req.body, res);
  });

  app.post("/logout", (req, res) => {
    console.log("logout");
    req.logout();
    res.status(200).send({ status: "logout success" });
  });

  // get current user profile
  app.get("/user/current", (req, res) => {
    console.log('looking')
    if (typeof req.user === "undefined") {
      return res.status(200).send({
        _id: -1
      });
    } else {
      userDao.findUserById(req.user._id, (err, user) => {
        if (err) {
          return res.status(500).send(err);
        }
        if (!user) {
          console.log("cannot find user");
          return res.status(200).send({ _id: -1 });
        }
        return res.status(200).send(user);
      });
    }
  });

  // get user profile by id
  app.get("/user/:id", function(req, res) {
    userDao.findUserById(req.params.id, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(200).send({ _id: -1 });
      }
      return res.status(200).send(user);
    });
  });
  
  // update user profile
  app.put("/user/current", function(req, res) {
    userDao.updateUser(req, res);
  });

  app.get("/usercount", function(req, res) {
    userDao.getUserCount(res);
  });
};
