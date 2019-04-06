const mongoose = require("mongoose");
const request = require("request");
const keys = require("../config/keys");
const commentModel = require("../models/comment.model");
const likeModel = require("../models/like.model");
const userModel = require("../models/user.model");
const subjectModel = require("../models/subject.model");


findCommentsBySubjectId = (subjectId, res) => {
  commentModel.find({ subject: subjectId })
    .populate("user")
    .exec(function(err, comments) {
      if (err) {
        return res.status(500).send(err);
      }
      console.log(comments);
      return res.status(200).send(comments);
    });
};

findCommentsByUserId = (userId, res) => {
  commentModel
    .find({ user: userId })
    .populate("subject")
    .exec(function(err, comments) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(comments);
    });
};

createComment = (userId, subject, commentContent, res) => {
  subject["likeCount"] = 0;
  userModel.findOne({ _id: userId }).exec(function(err, user) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(500).send({
        message: "not found user in database"
      });
    } else {
      subjectModel
        .findOne({ _id: subject._id })
        .exec(function(err, subjectDoc) {
          if (err) {
            return res.status(500).send(err);
          }
          if (!subjectDoc) {
            console.log("subject not found, create one");
            subjectModel.create(subject, (err, subjectDoc) => {
              if (err) {
                return res.status(500).send(err);
              }
              const comment = {
                user: user._id,
                subject: subject._id,
                content: commentContent,
                likeCount: 0
              };
              console.log("create a comment");
              commentModel.create(comment, (err, commentDoc) => {
                if (err) {
                  return res.status(500).send(err);
                }
                console.log(commentDoc);
                return res.status(200).send(commentDoc);
              });
            });
          } else {
            console.log("subject found, create a comment");
            const comment = {
              user: user._id,
              subject: subject._id,
              content: commentContent,
              likeCount: 0
            };
            commentModel.create(comment, (err, commentDoc) => {
              if (err) {
                return res.status(500).send(err);
              }
              console.log(commentDoc);
              return res.status(200).send(commentDoc);
            });
          }
        });
    }
  });
};

updateComment = (userId, comment, res) => {
  userModel.findOne({ _id: userId }).exec(function(err, user) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(500).send({
        message: "not found user in database"
      });
    }
    commentModel.update({_id: comment._id}, {$set: comment}, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send({ message: "comment updated" }); 
    });
    
  });
}

deleteComment = (userId, commentId, res) => {
  userModel.findOne({ _id: userId }).exec(function(err, user) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(500).send({
        message: "not found user in database"
      });
    }
    commentModel.deleteOne({ _id: commentId }, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      likeModel.deleteMany(
        { type: "COMMENT", comment: commentId },
        function(err) {
          if (err) {
            return res.status(500).send(err);
          }
          return res.status(200).send({ message: "comment removed" });
        }
      );
    });
  });
};

module.exports = {
  findCommentsBySubjectId,
  findCommentsByUserId,
  createComment,
  updateComment,
  deleteComment
};
