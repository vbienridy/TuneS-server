const keys = require("../config/keys");

// Mongoose models
const User = require("../models/db").User;
const Comment = require("../models/db").Comment;
const TrackComment = require("../models/db").TrackComment;
const AlbumComment = require("../models/db").AlbumComment;
const ArtistComment = require("../models/db").ArtistComment;


module.exports = app => {
    // routes for artist comments
    app.post('/api/artist/:id/comment', function (req, res) {
        if (typeof req.user === undefined) {
            return res.status(400).send({
                message: 'session expired'
            })
        }

        User.find({ sid: req.user.profile.id }).exec(function (err, users) {
            if (err) {
                return res.status(400).send({
                    message: 'search user error'
                })
            }
            if (users.length === 0) {
                return res.status(400).send({
                    message: 'not found user in database'
                })
            }

            let comment = new ArtistComment({
                content: req.body.comment, anony: false, artistId: req.params.id,
                user: users[0]._id
            });

            comment.save(function (err, comment) {
                if (err) {
                    return res.status(400).send({
                        message: 'unable to save comment'
                    })
                }
                res.json(comment)
            });
        })
    })

    app.get('/api/artist/:id/comments', function (req, res) {
        ArtistComment.find(
            { artistId: req.params.id }).populate('user', ['displayName', 'photo', 'sid']).sort({ updatedAt: -1 }).exec(
                function (err, comments) {
                    if (err) {
                        return res.status(400).send({
                            message: 'unable to find comments'
                        })
                    }
                    console.log(comments)
                    res.json(comments)
                })

            ;
    })

    app.delete('/api/artist/:id/comment', function (req, res) {
        ArtistComment.findOneAndDelete({ artistId: req.params.id }).exec(function (err, comment) {
            if (err) {
                return res.status(400).send({
                    message: 'unable to find comment'
                })
            }
            console.log("Deleted comment successfully!");
        });
    })

    // routes for track comments
    // app.post('/api/track/:id/comment', function (req, res) {

    // })

    // app.get('/api/track/:id/comments', function (req, res) {

    // })

    // app.delete('/api/track/:id/comment', function (req, res) {

    // })
}