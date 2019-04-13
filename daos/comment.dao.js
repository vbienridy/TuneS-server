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
      // console.log(comments);
      return res.status(200).send(comments);
    });
};

findCommentsByUserId = (userId, res) => {
  commentModel
    .find({ user: userId })
    .populate("subject")
    .exec(function(err, comments) {
      console.log(comments)
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
            // res.status(500).send("subject not found");

            //change create to save
            subjectModel.collection.save(subject, (err, subjectDoc) => {
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


//you should verify commentId belongs to this user before updating it, so this is deprecated
// updateComment = (userId, comment, res) => {
//   userModel.findOne({ _id: userId }).exec(function(err, user) {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     if (!user) {
//       return res.status(500).send({
//         message: "not found user in database"
//       });
//     }
//     commentModel.update({_id: comment._id}, {$set: comment}, function(err) {
//       if (err) {
//         return res.status(500).send(err);
//       }
//       return res.status(200).send({ message: "comment updated" }); 
//     });
    
//   });
// }

//must verify comment belongs to this user, frontend information is not ok for verification
deleteComment = (userId, commentId, res) => {
  commentModel.findOne({ _id: commentId }).populate("user").exec(function(err, comment) {
    console.log('commendDaoDel', comment)
    if (err) {
      return res.status(500).send(err);
    }
    if (!comment) {
      return res.status(500).send({
        message: "not found comment in database"
      });
    }

    if (comment.user._id !== userId){
      return res.status(500).send({
        message: "commment does not belong to this user"
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
  deleteComment
};
