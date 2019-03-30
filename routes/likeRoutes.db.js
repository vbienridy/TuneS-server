const mongoose = require("mongoose");
const userSchema = require("../models/user.schema");
const userModel = mongoose.model("UserModel", userSchema); 
const commentSchema = require("../models/comment.schema");
const commentModel = mongoose.model("CommentModel", commentSchema);

module.exports = app => {
  // route for like subject
  app.post("/api/like/subject/:type/:id", function(req, res) {
    userModel.findOne({ uid: req.user.profile.id }).exec(function(err, user) {
      if (err) {
        return res.status(400).send({
          message: "search user error"
        });
      }
      if (!user) {
        return res.status(400).send({
          message: "not found user in database"
        });
      } else {
        for (var i = 0; i < user.subjectLikes.length; i++) {
          if (
            user.subjectLikes[i].subjectType === req.params.type &&
            user.subjectLikes[i].subjectId === req.params.id
          ) {
            userModel
              .updateOne(
                { _id: user._id },
                {
                  $pull: {
                    subjectLikes: {
                      subjectType: req.params.type,
                      subjectId: req.params.id
                    }
                  }
                }
              )
              .exec();
            console.log("like removed");
            return;
            // res.json({ message: "like removed" });
          }
        }
        userModel
          .updateOne(
            { _id: user._id },
            {
              $push: {
                subjectLikes: {
                  subjectType: req.params.type,
                  subjectId: req.params.id
                }
              }
            }
          )
          .exec();
          console.log("like added");
          // res.json({ message: "like added" });
      }
    });
  });

  // route for subject isliked
  app.get("/api/isliked/:type/:id", function(req, res) {
    userModel.findOne({ uid: req.user.profile.id }).exec(function(err, user) {
      if (err) {
        return res.status(400).send({
          message: "search user error"
        });
      }
      if (!user) {
        return res.status(400).send({
          message: "not found user in database"
        });
      } else {
        for (var i = 0; i < user.subjectLikes.length; i++) {
          if (
            user.subjectLikes[i].subjectType === req.params.type &&
            user.subjectLikes[i].subjectId === req.params.id
          ) {
            console.log(true);
            res.json({ isliked: true });
            return;
          }
        }
        console.log(false);
        res.json({ isliked: false });
      }
    });
  });

  // route for like comment
  app.post("/api/like/comment/:id", function(req, res) {
    userModel
      .findOne({ uid: req.user.profile.id })
      .exec(function(err, user) {
        if (err) {
          return res.status(400).send({
            message: "search user error"
          });
        }
        if (!user) {
          return res.status(400).send({
            message: "not found user in database"
          });
        } else {
          userModel
            .updateOne(
              { _id: user._id },
              {
                $addToSet: {
                  commentLikes: mongoose.Types.ObjectId(req.params.id)
                }
              }
            )
            .exec();
          console.log("comment like added for user");
          commentModel
            .updateOne(
              { _id: mongoose.Types.ObjectId(req.params.id) },
              {
                $addToSet: {
                  userLikes: user._id
                }
              }
            )
            .exec();
          console.log("user like added for comment");
        }
      });
  });

  // route for get all comment likes
  app.get("/api/likes/comment", function(req, res) {
    userModel
      .findOne({ uid: req.user.profile.id })
      .exec(function(err, user) {
        if (err) {
          return res.status(400).send({
            message: "search user error"
          });
        }
        if (!user) {
          return res.status(400).send({
            message: "not found user in database"
          });
        } else {
          res.json(user.commentLikes)
        }
      });
  });

}