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



//userSchema
let userSchema = new mongoose.Schema({
    displayName: String, //payload.profile.displayName
    sid: String,//spotify id, payload.profile.id
    email: String, // payload.profile.emails[0].value   ?can be empty
    photo: String,//payload.profile.photos[0]  ?can be empty
    country: String, //payload.profile.country
    albumComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AlbumComment' }]
},
{
    timestamps: true// inner timestamps
});

//albumCommentSchema
let albumCommentSchema = new mongoose.Schema({
    content: String,
    anony: Boolean,
    albumId: String,
    sid: String,
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User' } },
{
    timestamps: true// inner timestamps
});

let AlbumComment = mongoose.model('AlbumComment', albumCommentSchema);
let User = mongoose.model('User', userSchema);
// const payload = {
//     profile: profile, //profile.id
//     accessToken: accessToken,
//     refreshToken: refreshToken,
//     expires_in: expires_in
// }
exports.dbSave = (payload, callback) =>{ //tested
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
        { upsert: true }, (err, res)=>{ if(err){return}; callback() })
    //if found a match, performs update, ignoring setOnInsert
    //if not found a match:insert by setOnInsert


}

// The call to mongoose.model establishes the name of the 
// collection the model is tied to, with the default being the
//  pluralized, lower-cased model name. So with your code, that 
//  would be 'models'. To use the model with the files collection, change that line to:

exports.app = app => { //teste
        app.get("/user/current", (req, res) => { 
        if (typeof req.user==='undefined') {
            console.log('wtf')
          res.json({
            id: -1,
            username: -1
          })
        }
        else {
            User.find( {sid: req.user.profile.id} ).exec(function (err, users) {
                if (err)
                    return console.log(err);
                console.log('u', users[0])
                //console.log(users)
                if (users.length>0){
                   res.json({ id: req.user.profile.id, username: users[0].displayName })
                }
                else
                {
                    res.json({
                    id: -1,
                    username: -1
                  })
                }
                // 'athletes' is a list
            })
        }
    })

    app.get('/user/profile/:sid', function(req, res) {
        //console.log(req.user)

        //console.log('id', req.user.profile.id)
        User.find( {sid: req.params.sid} ).exec(function (err, users) {
                if (err){
                    return res.status(400).send({
                        message: 'search user error'
                })
                }
                console.log('vvv, users')
                if (users.length===0){
                    return res.status(400).send({
                        message: 'cannot find user'
                })

                }
                if (( typeof req.user !== 'undefined') && (req.user.sid === req.params.sid) ){
                    return res.json(users[0])
                }//only return full profile if it's "me"( in session and it's me who fetched)

                return res.json({
                    sid: -1, displayName: users[0].displayName, photo: users[0].photo, country: users[0].country

                })
        }
        )
    })

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

    app.post('/api/album/:id/comment', function (req, res) {
        
        //console.log(req.params.search, 1)
        if (typeof res.user === undefined){
            return res.status(400).send({
                message: 'session expired'
        })
        }  

        User.find( {sid: req.user.profile.id} ).exec(function (err, users) {
            if (err){
                return res.status(400).send({
                message: 'search user error'})
                }
                if (users.length===0){
                    return res.status(400).send({
                        message: 'not found user in database'})
                }
                
                let comment = new AlbumComment({ content: req.body.comment, anony: false, albumId: req.params.id, 
                    user: users[0]._id});

                comment.save(function (err, comment) {
                    //console.log("save tried")
                    if (err){
                        return res.status(400).send({
                        message: 'unable to save comment'})
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
            { albumId: req.params.id}).populate('user', ['displayName', 'photo', 'sid']).sort({updatedAt: -1}).exec(
            function (err, comments) {
                if (err){
                    return res.status(400).send({
                    message: 'unable to find comments'})
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



}