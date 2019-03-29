const mongoose = require("mongoose");
const userSchema = require("../models/user.schema");
const userModel = mongoose.model("UserModel", userSchema); 

module.exports = app => {
  // route for like subject
  app.post("/api/like/:type/:id", function(req, res) {
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
            .update(
              { _id: user._id },
              {
                $push: {
                  commentLikes: mongoose.Types.ObjectId(req.params.id)
                }
              }
            )
            .exec();
        }
      });
  });

}