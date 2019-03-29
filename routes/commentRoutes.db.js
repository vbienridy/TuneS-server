const mongoose = require('mongoose'); 
const userSchema = require('../models/user.schema'); 
const userModel = mongoose.model("UserModel", userSchema); 
const commentSchema = require('../models/comment.schema');
const commentModel = mongoose.model('CommentModel', commentSchema);

module.exports = app => {
  // route for adding comments
  app.post("/api/comment/:type/:id", function(req, res) {
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
      }

      const comment = {
        user: user,
        content: req.body.comment,
        subjectType: req.params.type,
        subjectId: req.params.id,
        likedUsers: []
      };

      commentModel.create(comment, (err, commentDoc) => {
        console.log("*******");
        console.log(commentDoc);
        if (err) {
          console.log(err);
        } else {
          userModel.update(
            { _id: user._id },
            { $push: { comments: commentDoc._id } }
          ).exec();
          res.json(comment);
        }
      });

    });

  });


  // route for retrieving comments
  app.get("/api/comments/:type/:id/", function(req, res) {
    //better paractice is to use references in mongoose
    console.log("searching");
    commentModel.find({
      subjectType: req.params.type,
      subjectId: req.params.id
    })
      // .populate("user", ["displayName", "photo", "uid"])
      .sort({ updatedAt: -1 })
      .exec(function(err, comments) {
        if (err) {
          return res.status(400).send({
            message: "unable to find comments"
          });
        }
        console.log(comments);
        res.json(comments);
        // 'athletes' is a list
      });
    //return json:
    // [ { _id: 5c904c086c56ec4ce336493a,
    //     content: 'asd',
    //     anony: false,
    //     albumId: '3T4tUhGYeRNVUGevb0wThu',
    //     user:
    //      { _id: 5c904be8c6991d796841f198, displayName: 'yang', photo: '' },
    //     createdAt: 2019-03-19T01:55:20.865Z,
    //     updatedAt: 2019-03-19T01:55:20.865Z,
    //     __v: 0 } ]
  });
};
