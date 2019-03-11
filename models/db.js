const keys = require('../config/keys');

// your application requests authorization
const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (Buffer.from(keys.spotifyClientID + ':' + keys.spotifyClientSecret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};



const mongoose = require('mongoose');
mongoose.connect('mongodb://vbienridy:vb123456@ds211096.mlab.com:11096/tune-s');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));//only once
db.once('open', function () { console.log("we are connected") }) //only once?

let commentSchema = new mongoose.Schema({
    content: String,
    anony: Boolean,
    trackId: String
},
    {
        timestamps: true// inner timestamps
    });

let Comment = mongoose.model('Comment', commentSchema);//This will automatically add createdAt and updatedAt fields to your schema.


module.exports = app => {

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
    });

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




}