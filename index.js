const keys = require('./config/keys');
const express = require('express')
const passport = require("passport");
const cookieSession = require('cookie-session');
const cors = require('cors');
const app = express()
const request = require('request'); // "Request" library
app.use(express.json())    // <==== parse request body as JSON
app.use(cors({ credentials: true, origin: keys.frontend })) // cors
console.log("pack", cors);
// app.use(function (req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'https://tune-s.herokuapp.com');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     // Pass to next layer of middleware
//     next();
// });

// Passport session setup.

// set up session data storing functions, essensially and magically
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// set up session , essensially and magically
app.use(
    cookieSession({ name: 'session', secret: "keyboard cat", maxAge: 60 * 60 * 1000 }) //resave: true, saveUninitialized: true
);

// set up passport , essensially and magically
app.use(passport.initialize()); 

app.use(passport.session());

// Passport Config
require("./config/passport")(passport);

require('./routes/authRoutes')(app);


require('./routes/browseRoutes')(app);
require('./models/db').app(app);

const PORT = process.env.PORT || 5000;
console.log('port',PORT)
app.listen(PORT);

