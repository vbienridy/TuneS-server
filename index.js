const keys = require('./config/keys');
const express = require('express')
const passport = require("passport");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express()
const request = require('request'); // "Request" library
// app.use(cors({credentials:true, origin: 'https://tune-s.herokuapp.com'}))
app.use(express.json())    // <==== parse request body as JSON
app.use(cors({credentials:true, origin: 'https://tune-s.herokuapp.com'}))
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
require('./routes/browseRoutes')(app);
require('./models/db')(app);
// Passport session setup.
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// app.use(
//   session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
// );

// Passport middleware


app.use(passport.initialize());
// app.use(passport.session());


//local
//app.use(cors());
// app.use(cookieParser());

// Passport Config
require("./config/passport")(passport);

//remote
// app.use(cors({ credentials: true, origin: 'https://tune-s.herokuapp.com' }));

require('./routes/authRoutes')(app);


const PORT = process.env.PORT || 5009;
console.log('port',PORT)
console.log('env', process.env)
app.listen(PORT);//