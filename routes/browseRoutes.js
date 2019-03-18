const request = require('request'); // "Request" library

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

module.exports = app => {
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
          res.json(body)
        });
        //res.send('hello world')
      }
    });
  })

  app.get('/api/track/:id', function (req, res) {
    //console.log(req.params.search, 1)

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        // use the access token to access the Spotify Web API
        let token = body.access_token;
        //https://api.spotify.com/v1/search?q=Muse&type=track
        let options2 = {
          url: 'https://api.spotify.com/v1/tracks/' + req.params.id,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };
        //console.log(req.params.search)
        //res.json({me: 1})
        request.get(options2, function (error, response, body) {

          //error handling here can be better

          //console.log(body);
          res.json(body)//send first one met
        });

        //res.send('hello world')

      }
    });
  })

  app.get("/api/album/:id", function(req, res) {
    //console.log(req.params.search, 1)

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        // use the access token to access the Spotify Web API
        let token = body.access_token;

        //https://api.spotify.com/v1/search?q=Muse&type=track
        let options2 = {
          url: "https://api.spotify.com/v1/albums/" + req.params.id,
          headers: {
            Authorization: "Bearer " + token
          },
          json: true
        };
        //console.log(req.params.search)
        //res.json({me: 1})
        request.get(options2, function(error, response, body) {
          //error handling here can be better

          //console.log(body);
          res.json(body); //send first one met
        });

        //res.send('hello world')
      }
    });
  });

  app.get("/api/artist/:id", function (req, res) {
    console.log("first")

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // use the access token to access the Spotify Web API
        let token = body.access_token;
          console.log("second", token)
        //https://api.spotify.com/v1/search?q=Muse&type=track
        let options2 = {
          url: "https://api.spotify.com/v1/artists/" + req.params.id,
          headers: {
            Authorization: "Bearer " + token
          },
          json: true
        };
        //console.log(req.params.search)
        //res.json({me: 1})
        request.get(options2, function (error, response, body) {
          //error handling here can be better

          //console.log(body);
            console.log(body)
          res.json(body); //send first one met
        });

        //res.send('hello world')
      }
    });
  });

  app.get("/api/playlist/:id", function(req, res) {
    //console.log(req.params.search, 1)
      console.log("first")
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        // use the access token to access the Spotify Web API
        let token = body.access_token;
        console.log("second")
        //https://api.spotify.com/v1/search?q=Muse&type=track
        let options2 = {
          url: "https://api.spotify.com/v1/playlists/" + req.params.id,
          headers: {
            Authorization: "Bearer " + token
          },
          json: true
        };
        //console.log(req.params.search)
        //res.json({me: 1})
        request.get(options2, function(error, response, body) {
          //error handling here can be better

          //console.log(body);
          res.json(body); //send first one met
        });

        //res.send('hello world')
      }
    });
  });

}