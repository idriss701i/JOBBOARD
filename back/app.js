const express = require("express"),
  app = express(),
  authRoute = require("./routes/authRoute"),
  companyRoute = require('./routes/companyRoute'),
  auth = require('./middleware/auth.js')(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  User = require("./models/User.model"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  connect = require("./config/connectDb"), 
  cors = require('cors'), 
  jobRoute = require('./routes/jobRoute'), 
  applyRoute = require('./routes/applyRoute');

connect();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(auth.initialize());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))



// Passport Config
passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/users", authRoute);
app.use("/companies", companyRoute);
app.use("/jobs", jobRoute);
app.use("/applies", applyRoute);

app.listen(3001, () => {
  console.log("Server Started at 3001");
});