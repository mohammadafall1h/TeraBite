
/* Dependencies */
var mongoose = require('mongoose'),
  models = require('../models/model.js');
const bcrypt = require('bcrypt');

// create new user account
exports.create = function(req, res) {

  var user = new models.users(req.body);

  //encrypt password
  let hash = bcrypt.hashSync(user.pass, 10);
  user.pass = hash;

  user.save(function(err) {
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
