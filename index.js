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

//local
// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.use(cookieParser());

// Passport Config
require("./config/passport")(passport);


//remote
app.use(cors({ credentials: true, origin: 'https://tunes-client.herokuapp.com' }));

require('./routes/authRoutes')(app);
require('./routes/browseRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);