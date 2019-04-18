const mongoose = require("mongoose");
const request = require("request");
const keys = require("../config/keys");
const likeModel = require("../models/like.model");
const commentModel = require("../models/comment.model");
const userModel = require("../models/user.model");
const subjectModel = require("../models/subject.model");

findSubjectIsLiked = (userId, subjectId, res) => {
  userModel.findOne({ _id: userId }).exec(function(err, user) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(500).send({
        message: "user not found in database"
      });
    }
    likeModel
      .findOne({ type: "SUBJECT", user: userId, subject: subjectId })
      .exec(function(err, like) {
        if (err) {
          return res.status(500).send(err);
        }
        if (!like) {
          return res.status(200).send({ isliked: false });
        }
        return res.status(200).send({ isliked: true });
      });
  });
};

findSubjectLikesByUserId = (userId, res) => {
  likeModel.find({ type: "SUBJECT", user: userId })
    .populate("subject")
    .exec(function(err, likes) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(likes);
    });
};

findCommentLikesBySubjectId = (subjectId, res) => {
  likeModel.find({ type: "COMMENT", subject: subjectId }).exec(function(err, likes) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(likes);
  })
};

findCommentLikesByUserId = (userId, res) => {
  console.log("***");
  likeModel
    .find({ type: "COMMENT", user: userId })
    .populate({
      path: "comment", 
      populate: {
        path: "subject"
      }
    })
    .exec(function(err, likes) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(likes);
    });
};

likeSubject = (userId, subject, res) => {//this is not transactional, may cause like count to change unexpectedly, but promised for performance
  subject["likeCount"] = 1;
  console.log(subject);
  userModel.findOne({ _id: userId }).exec(function(err, user) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(500).send({
        message: "user not found in database"
      });
    } else {
      subjectModel
        .findOne({ _id: subject._id })
        .exec(function(err, subjectDoc) {
          if (err) {
            return res.status(500).send(err);
          }
          if (!subjectDoc) {//not transactional
            console.log("subject not found, create one");
            subjectModel.collection.save(subject, (err, subjectDoc) => {
              console.log(subjectDoc);
              if (err) {
                return res.status(500).send(err);
              }
              console.log("create a like");
              likeModel.create(
                {
                  type: "SUBJECT",
                  user: userId,
                  subject: subject._id
                },
                (err, likeDoc) => {
                  if (err) {
                    return res.status(500).send(err);
                  }
                  console.log(likeDoc);
                  return res.status(200).send(likeDoc);
                }
              );
            });
          } else {
            likeModel
              .findOne({
                type: "SUBJECT",
                user: userId,
                subject: subject._id
              })
              .exec(function(err, like) {
                if (err) {
                  return res.status(500).send(err);
                }
                if (!like) {
                  subjectDoc.likeCount++;
                  console.log("like not found, create one");
                  likeModel.create(
                    {
                      type: "SUBJECT",
                      user: userId,
                      subject: subject._id
                    },
                    (err, likeDoc) => {
                      if (err) {
                        return res.status(500).send(err);
                      }
                      console.log(likeDoc);
                      return res.status(200).send(likeDoc);
                    }
                  );
                } else {
                  subjectDoc.likeCount--;
                  console.log("like found, delete it");
                  likeModel.deleteOne(
                    {
                      type: "SUBJECT",
                      user: userId,
                      subject: subject._id
                    },
                    function(err) {
                      if (err) {
                        return res.status(500).send(err);
                      }
                      return res
                        .status(200)
                        .send({ message: "subject like removed" });
                    }
                  );
                }
                subjectModel.updateOne(
                  { _id: subject._id },
                  { $set: subjectDoc },
                  function(err) {
                    if (err) {
                      return res.status(500).send(err);
                    }
                  }
                );
              });
          }
        });
    }
  });
};


likeComment = (userId, commentId, res) => {//not transcational, so user may like a comment that does not exist
  //not using transcation for performance
  userModel.findOne({ _id: userId }).exec(function(err, user) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(500).send({
        message: "user not found in database"
      });
    } else {
      console.log('search',{ type: "COMMENT", user: userId, comment: commentId})
      likeModel
        .findOne({ type: "COMMENT", user: userId, comment: commentId})
        .exec(function(err, like) {
          if (err) {
            return res.status(500).send(err);
          }
          console.log('like?', like)
          if (!like) {
            console.log("comment like not found, create one");
            likeModel.collection.save(
              { type: "COMMENT", user: userId, comment: mongoose.Types.ObjectId(commentId) },
              (err, likeDoc) => {
                if (err) {
                  return res.status(500).send(err);
                }
                // console.log(likeDoc);
                return res.status(200).send(likeDoc);
              }
            );
            commentModel.updateOne(
              { _id: commentId },
              { $inc: { likeCount: 1 } },
              function(err) {
                if (err) {
                  return res.status(500).send(err);
                }
              }
            );
          } else {
            console.log("comment like found, delete it");
            likeModel.deleteOne({
              type: "COMMENT",
              user: userId,
              comment: commentId
            }, function(err) {
              if (err) {
                return res.status(500).send(err);
              }
              return res
                .status(200)
                .send({ message: "comment like removed" });
            });
            commentModel.updateOne(
              { _id: commentId },
              { $inc: { likeCount: -1 } },
              function(err) {
                if (err) {
                  return res.status(500).send(err);
                }
              }
            );
          }
        });
    }
  });
};

// deleteSubjectLike = (userId, subjectId, res) => {
//   userModel.findOne({ _id: userId }).exec(function(err, user) {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     if (!user) {
//       return res.status(500).send({
//         message: "user not found in database"
//       });
//     }
//     likeModel.deleteOne({ type: "SUBJECT", user: userId, subject: subjectId});
//     return res.status(200).send({ message: "subject like removed" });
//   });
// }

// deleteCommentLike = (userId, commentId, res) => {
//   userModel.findOne({ _id: userId }).exec(function(err, user) {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     if (!user) {
//       return res.status(500).send({
//         message: "user not found in database"
//       });
//     }
//     likeModel.deleteOne({
//       type: "COMMENT",
//       user: userId,
//       comment: commentId
//     });
//     return res.status(200).send({ message: "comment like removed" });
//   });
// }

module.exports = {
  findSubjectIsLiked,
  findSubjectLikesByUserId,
  findCommentLikesBySubjectId,
  findCommentLikesByUserId,
  likeSubject,
  likeComment
};
