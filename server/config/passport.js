/* Dependencies */
var mongoose = require('mongoose'),
  models = require('../models/model.js'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

//configure the strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    //find a user that matches the username
    models.users.findOne({ username: username }, function (err, user) {
      if (err) {
        console.log("There was an error when authenticating the username.");
        return done(err);
      }
      if (!user) {
        console.log("That username was not found.");
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validatePassword(password)) {
        console.log("That password did not match the username.");
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("Correct username and password combo.");
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.users.findById(id, function(err, user) {
    done(err, user);
  });
});
