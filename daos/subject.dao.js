const mongoose = require("mongoose");
const subjectModel = require("../models/subject.model");
const likeModel = require("../models/like.model");
const commentModel = require("../models/comment.model");

findTopSubjects = res => {
  subjectModel
    .find({type: "album"})
    .sort([["likeCount", -1]])
    .exec(function(err, albums) {
      if (err) {
        return res.status(500).send(err);
      }
      subjectModel
        .find({ type: "artist" })
        .sort([["likeCount", -1]])
        .exec(function(err, artists) {
          if (err) {
            return res.status(500).send(err);
          }
          subjectModel
            .find({ type: "track" })
            .sort([["likeCount", -1]])
            .exec(function(err, tracks) {
              if (err) {
                return res.status(500).send(err);
              }
              const topSubjects = {
                topTracks: tracks.length > 10 ? tracks.slice(10) : tracks,
                topAlbums: albums.length > 10 ? albums.slice(10) : albums,
                topArtists: artists.length > 10 ? artists.slice(10) : artists
              };
              res.status(200).send(topSubjects);
            });
        });
    });
};

module.exports = { findTopSubjects };
