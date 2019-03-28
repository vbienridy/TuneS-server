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
const commentSchema = new mongoose.Schema({
    content: String,
    anony: Boolean,
    trackId: String
}, { timestamps: true });// inner timestamps
//This will automatically add createdAt and updatedAt fields to your schema.

//userSchema
const userSchema = new mongoose.Schema({
    displayName: String, //payload.profile.displayName
    sid: String,//spotify id, payload.profile.id
    email: String, // payload.profile.emails[0].value   ?can be empty
    photo: String,//payload.profile.photos[0]  ?can be empty
    country: String, //payload.profile.country
    likeAlbums: [{ albumId: String }],
    likeArtists: [{ artistId: String }],
    likeTracks: [{ trackId: String }],
    albumComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AlbumComment' }]
}, { timestamps: true });// inner timestamps

//albumCommentSchema
const albumCommentSchema = new mongoose.Schema({
    content: String,
    anony: Boolean,
    albumId: String,
    sid: String,
    likedUsers: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });// inner timestamps

//artistCommentSchema
const artistCommentSchema = new mongoose.Schema({
    content: String,
    anony: Boolean,
    artistId: String,
    sid: String,
    likedUsers: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });// inner timestamps

//trackCommentSchema
const trackCommentSchema = new mongoose.Schema({
    content: String,
    anony: Boolean,
    trackId: String,
    sid: String,
    likedUsers: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });// inner timestamps

exports.Comment = Comment = mongoose.model('Comment', commentSchema);
exports.User = User = mongoose.model('User', userSchema);
exports.AlbumComment = AlbumComment = mongoose.model('AlbumComment', albumCommentSchema);
exports.ArtistComment = ArtistComment = mongoose.model('ArtistComment', artistCommentSchema);
exports.TrackComment = TrackComment = mongoose.model('TrackComment', trackCommentSchema);

// const payload = {
//     profile: profile, //profile.id
//     accessToken: accessToken,
//     refreshToken: refreshToken,
//     expires_in: expires_in
// }
exports.dbSave = (payload, callback) => { //tested
    let user = {
        displayName: payload.profile.displayName,
        sid: payload.profile.id,
        email: payload.profile.emails.length > 0 ? payload.profile.emails[0].value : "",
        photo: payload.profile.photos.length > 0 ? payload.profile.photos[0] : "",
        country: payload.profile.country
    };//exception here will cause failure of passport?

    // db.collection.update(
    //     <query>,
    //     { $setOnInsert: { <field1>: <value1>, ... } },
    //     { upsert: true }
    //  )

    //https://stackoverflow.com/questions/32430384/mongodb-insert-if-it-doesnt-exist-else-skip
    return db.collection('users').update({ sid: payload.profile.id }, { $setOnInsert: user },
        { upsert: true }, (err, res) => { if (err) { return }; callback() })
    //if found a match, performs update, ignoring setOnInsert
    //if not found a match:insert by setOnInsert


}

// The call to mongoose.model establishes the name of the 
// collection the model is tied to, with the default being the
//  pluralized, lower-cased model name. So with your code, that 
//  would be 'models'. To use the model with the files collection, change that line to: