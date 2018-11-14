/* Dependencies */
var mongoose = require('mongoose'),
  models = require('../models/model.js');

const bcrypt = require('bcryptjs');

// create new user account
exports.create = function(req, res) {

  var user = {
    email: "",
    username: "",
    isEventCreator: false,
    org: "",
    hash: ""
  }

  //fill userModel object to be saved with passed information
  user.email = req.body.email;
  user.username = req.body.username;
  user.isEventCreator = req.body.isEventCreator;
  user.org = req.body.org;

  //encrypt password
  var salt = bcrypt.genSaltSync(10);
  user.hash = bcrypt.hashSync(req.body.pass, salt);

  var userDone = new models.users(user);

  userDone.save(function(err) {
    if(err) {

      console.log("There was an error:\n" + err);

      //Duplication error code
      if(err.code === 11000){
        //check for substring in error to see which field was duplicated
        var errStr = JSON.stringify(err);
        if(errStr.indexOf('email') != -1)
          res.status(400).send('That email is already taken. Try using another one.');
        else
          res.status(400).send('That username is already taken. Try using another one.');
      }
      else {
          //non duplication error
          res.status(400).send('Could not connect the the database. Refresh and try again.\nError: ' + err.name);
      }

    } else {
      res.send('Account created successfully. Select \'Ok\' to move to the sign-in page.');
    }
  });
};
