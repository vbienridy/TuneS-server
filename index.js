const keys = require('./config/keys');
const express = require('express')
const passport = require("passport");
const cookieSession = require('cookie-session');
const cors = require('cors');
const app = express();
require('./data/db')();
app.use(express.json())    // <==== parse request body as JSON
app.use(cors({ credentials: true, origin: keys.frontend })) // cors
console.log("pack", cors);

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

require('./routes/userRoutes.db')(app);
require('./routes/browseRoutes')(app);
require('./routes/commentRoutes.db')(app);
require("./routes/likeRoutes.db")(app);

const PORT = process.env.PORT || 5000;
console.log('port',PORT)
app.listen(PORT);

