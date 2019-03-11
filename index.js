const keys = require('./config/keys');
const express = require('express')
const passport = require("passport");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express()

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
app.use(express.json())    // <==== parse request body as JSON

//local
app.use(cors());
// app.use(cookieParser());

// Passport Config
require("./config/passport")(passport);


//remote
// app.use(cors({ credentials: true, origin: 'https://tune-s.herokuapp.com' }));

require('./routes/authRoutes')(app);
require('./routes/browseRoutes')(app);
require('./models/db')(app);

const PORT = process.env.PORT || 5009;
app.listen(PORT);