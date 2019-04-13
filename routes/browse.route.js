const request = require('request'); // "Request" library
const keys = require('../config/keys');

const subjectDao = require("../daos/subject.dao");

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

module.exports = app => {
  // search subject by name
  app.get('/api/search/:search/type/:type', function (req, res) {
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // use the access token to access the Spotify Web API
        const token = body.access_token;
        //https://api.spotify.com/v1/search?q=Muse&type=track
        const options2 = {
          url:
            "https://api.spotify.com/v1/search?q=" +
            req.params.search +
            "&type=" +
            req.params.type,
          headers: {
            Authorization: "Bearer " + token
          },
          json: true
        };
        request.get(options2, function (error, response, body) {
          //error handling here can be better
          //console.log(body);
          return res.json(body)
        });
        //res.send('hello world')
      }
    });
  });

  // get subject content from spotify api
  app.get('/api/subject/:type/:id', function (req, res) {
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const token = body.access_token;
        const options2 = {
          url:
            "https://api.spotify.com/v1/" +
            req.params.type +
            "s/" +
            req.params.id,
          headers: {
            Authorization: "Bearer " + token
          },
          json: true
        };
        request.get(options2, function (error, response, body) {
          return res.json(body);
        });
      }
    });
  });

  app.get('/api/subject/top', function (req, res) {
    console.log("findTop")
    subjectDao.findTopSubjects(res);
  });

}