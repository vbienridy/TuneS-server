const express = require("express");
const passport = require("passport");
// const session = require("express-session");
var cors = require("cors");
const users = require("./routes/api/users");
var cookieParser = require("cookie-parser");
const app = express();

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//
// app.use(
//   session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
// );

// Passport middleware
app.use(passport.initialize());
// app.use(passport.session());
app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/", users);

// app.get("/", (req, res) => res.send("Hello"));

const port = process.env.PORT || 8888;

app.listen(port, () => console.log(`Server running on port ${port}`));
