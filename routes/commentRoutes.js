const keys = require("../config/keys");

// Mongoose models
const User = require("../models/db").User;
const Comment = require("../models/db").Comment;
const TrackComment = require("../models/db").TrackComment;
const AlbumComment = require("../models/db").AlbumComment;
const ArtistComment = require("../models/db").ArtistComment;


module.exports = app => {
    // routes for anonymous track comments
    app.post('/api/track/:id/comment', function (req, res) {
        //console.log(req.params.search, 1)
        let comment = new Comment({ content: req.body.comment, anony: true, trackId: req.params.id });
        // console.log(req.body.comment)

        comment.save(function (err, comment) {
            //console.log("save tried")
            if (err) return console.log(err);
            res.json(req.body)
            // we're connected!
        });
        //what if returned?

        //res.json({status: "fail"}) //if not successful
    })

    app.get('/api/track/:id/comments', function (req, res) {//better paractice is to use references in mongoose
        //console.log("searching")
        Comment.find(
            { trackId: req.params.id }).sort({ updatedAt: -1 }).exec(
                function (err, comments) {
                    if (err)
                        return console.log(err);
                    res.json(comments)
                    // 'athletes' is a list
                })
            ;

        //what if returned?

        //res.json({status: "fail"}) //if not successful
    });//previous comment schemas also included in find result...

    // routes for album comments
    app.post('/api/album/:id/comment', function (req, res) {

        //console.log(req.params.search, 1)
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

            let comment = new AlbumComment({
                content: req.body.comment, anony: false, albumId: req.params.id,
                user: users[0]._id
            });

            comment.save(function (err, comment) {
                //console.log("save tried")
                if (err) {
                    return res.status(400).send({
                        message: 'unable to save comment'
                    })
                }
                // console.log('y', comment)
                //console.log(comment)

                res.json(comment)
                // we're connected!
            });
        })

        // console.log(req.body.comment)

        //what if returned?

        //res.json({status: "fail"}) //if not successful
    });

    app.get('/api/album/:id/comments', function (req, res) {//better paractice is to use references in mongoose
        console.log("searching")
        AlbumComment.find(
            { albumId: req.params.id }).populate('user', ['displayName', 'photo', 'sid']).sort({ updatedAt: -1 }).exec(
                function (err, comments) {
                    if (err) {
                        return res.status(400).send({
                            message: 'unable to find comments'
                        })
                    }
                    console.log(comments)
                    res.json(comments)
                    // 'athletes' is a list
                })

            ;
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