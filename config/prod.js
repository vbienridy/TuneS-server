module.exports = {
  spotifyClientID: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callBackURL: process.env.SPOTIFY_CALLBACK_URL,
  mongodb: process.env.MONGODB_URL,
  // frontend:["https://tune-s.herokuapp.com", "http://tune-s.herokuapp.com"]
  frontend: [
    "https://tunes-app.herokuapp.com",
    "http://tunes-app.herokuapp.com"
  ]
};
