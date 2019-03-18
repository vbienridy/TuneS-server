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
mongoose.connect(keys.mongodb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));//only once
db.once('open', function () { console.log("we are connected") }) //only once?

//schemas
// Everything in Mongoose starts with a Schema. 
// Each schema maps to a MongoDB collection and defines the shape of the 
// documents within that collection.
//commentSchema
let commentSchema = new mongoose.Schema({
    content: String,
    anony: Boolean,
    trackId: String
},
    {
        timestamps: true// inner timestamps
    });

let Comment = mongoose.model('Comment', commentSchema);//This will automatically add createdAt and updatedAt fields to your schema.


//albumCommentSchema
let albumCommentSchema = new mongoose.Schema({
        content: String,
        anony: Boolean,
        albumId: String
    },
    {
        timestamps: true// inner timestamps
    });

let AlbumComment = mongoose.model('AlbumComment', albumCommentSchema);

//userSchema
let userSchema = new mongoose.Schema({
    displayName: String, //payload.profile.displayName
    _id: String, //spotify id, payload.profile.id
    email: String, // payload.profile.emails[0].value   ?can be empty
    photo: String,//payload.profile.photos[0]  ?can be empty
    country: String //payload.profile.country
},
{
    timestamps: true// inner timestamps
});

let User = mongoose.model('User', userSchema);
// const payload = {
//     profile: profile, //profile.id
//     accessToken: accessToken,
//     refreshToken: refreshToken,
//     expires_in: expires_in
// }
exports.dbSave = payload =>{ //tested
    let user = { displayName: payload.profile.displayName, 
        sid: payload.profile.id, 
        email: payload.profile.emails.length>0 ? payload.profile.emails[0].value : "",
        photo: payload.profile.photos.length>0 ? payload.profile.photos[0] : "",
        country: payload.profile.country
    };//exception here will cause failure of passport?

    // db.collection.update(
    //     <query>,
    //     { $setOnInsert: { <field1>: <value1>, ... } },
    //     { upsert: true }
    //  )

    //https://stackoverflow.com/questions/32430384/mongodb-insert-if-it-doesnt-exist-else-skip
    return db.collection('users').update({sid: payload.profile.id}, { $setOnInsert: user },
        { upsert: true })
    //if found a match, performs update, ignoring setOnInsert
    //if not found a match:insert by setOnInsert


}

// The call to mongoose.model establishes the name of the 
// collection the model is tied to, with the default being the
//  pluralized, lower-cased model name. So with your code, that 
//  would be 'models'. To use the model with the files collection, change that line to:

exports.app = app => { //tested
    app.get('/api/user/profile', function(req, res) {
        //console.log(req.user)
        if (typeof req.user === 'undefined')
            {return res.status(400).send({
                message: 'session expired'
             });}
        console.log('id', req.user.profile.id)
        User.find( {sid: req.user.profile.id} ).exec(function (err, user) {
                if (err)
                    return console.log(err);
                console.log('u', user)
                res.json(user)
                // 'athletes' is a list
            })
    }
    )

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
        console.log("searching")
        AlbumComment.find(
            { albumId: req.params.id}).sort({updatedAt: -1}).exec(
            function (err, comments) {
                if (err)
                    return console.log(err);
                console.log(comments)
                res.json(comments)
                // 'athletes' is a list
            })
        ;

        //what if returned?

        //res.json({status: "fail"}) //if not successful
    });



}