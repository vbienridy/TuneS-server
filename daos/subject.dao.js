const mongoose = require("mongoose");
const subjectModel = require("../models/subject.model");
const likeModel = require("../models/like.model");
const commentModel = require("../models/comment.model");

findSubjectById = id => {
  return subjectModel.findById(id).exec();
};
update = (id, edited) => {
  // By default, mongoose only applies defaults when you create a new document. It will not set defaults if you use update() and findOneAndUpdate(). However, mongoose 4.x lets you opt-in to this behavior using the setDefaultsOnInsert option.

  // https://mongoosejs.com/docs/defaults.html#the-setdefaultsoninsert-option
  let options = {
    // Return the document after updates are applied
    new: true,
    upsert: true
  };
  // https://docs.mongodb.com/manual/reference/operator/update/setOnInsert/
  //if no match: set+setOnInsert(set id), if match: only set
  return subjectModel
    .findOneAndUpdate(
      { _id: id },
      { $set: edited, $setOnInsert: { playCount: 0 } },
      options
    )
    .exec();
};
findTopSubjects = res => {
  subjectModel
    .find({ type: "album" })
    .sort([["likeCount", -1]]).limit(10)
    .exec(function(err, albums) {
      if (err) {
        return res.status(500).send(err);
      }
      subjectModel
        .find({ type: "artist" })
        .sort([["likeCount", -1]]).limit(10)
        .exec(function(err, artists) {
          if (err) {
            return res.status(500).send(err);
          }
          subjectModel
            .find({ type: "track" })
            .sort([["likeCount", -1]]).limit(10)
            .exec(function(err, tracks) {
              if (err) {
                return res.status(500).send(err);
              }
              const topSubjects = {
                topTracks:  tracks,
                topAlbums: albums,
                topArtists: artists
                
              };
              res.status(200).send(topSubjects);
            });
        });
    });
};

module.exports = { findTopSubjects, findSubjectById, update };

//
