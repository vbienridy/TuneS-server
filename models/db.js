const keys = require('../config/keys');

// your application requests authorization
const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(keys.spotifyClientID + ':' + keys.spotifyClientSecret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};



const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:12345/test');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));//only once
db.once('open', function() {console.log("we are connected")}) //only once?

let commentSchema = new mongoose.Schema({
    content: String,
    anony: Boolean,
    trackId: String
},
    {
        timestamps: true// inner timestamps
    });

let Comment = mongoose.model('Comment', commentSchema);//This will automatically add createdAt and updatedAt fields to your schema.

let albumCommentSchema = new mongoose.Schema({
        content: String,
        anony: Boolean,
        albumId: String
    },
    {
        timestamps: true// inner timestamps
    });

let AlbumComment = mongoose.model('AlbumComment', albumCommentSchema);

module.exports = app => {

    app.post('/api/track/:id/comment', function (req, res) {
        //console.log(req.params.search, 1)
        let comment = new Comment({ content: req.body.comment, anony: true, trackId: req.params.id});
        // console.log(req.body.comment)

        comment.save(function (err, comment) {
            //console.log("save tried")
            if (err) return console.log(err);
            res.json(req.body)
            // we're connected!
        });
        //what if returned?

        //res.json({status: "fail"}) //if not successful
    });

    app.get('/api/track/:id/comments', function (req, res) {//better paractice is to use references in mongoose
        //console.log("searching")
        Comment.find(
            { trackId: req.params.id }).sort({updatedAt: -1}).exec(
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

    app.post('/api/album/:id/comment', function (req, res) {
        //console.log(req.params.search, 1)
        let comment = new AlbumComment({ content: req.body.comment, anony: true, albumId: req.params.id});
        // console.log(req.body.comment)

        comment.save(function (err, comment) {
            //console.log("save tried")
            if (err) return console.log(err);
            console.log(comment)
            res.json(comment)
            // we're connected!
        });
        //what if returned?

        //res.json({status: "fail"}) //if not successful
    });

    app.get('/api/album/:id/comments', function (req, res) {//better paractice is to use references in mongoose
        //console.log("searching")
        AlbumComment.find(
            { albumId: req.params.id}).sort({updatedAt: -1}).exec(
            function (err, comments) {
                if (err)
                    return console.log(err);
                //ßconsole.log(comments)
                res.json(comments)
                // 'athletes' is a list
            })
        ;

        //what if returned?

        //res.json({status: "fail"}) //if not successful
    });



}