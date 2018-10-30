
/* Dependencies */
var mongoose = require('mongoose'),
  models = require('../models/model.js');

// create new user account
/* TODO:
Have a password encryption function that is called before user account is saved to db
Redirect to sign-in after account successfully created
*/
exports.create = function(req, res) {

  var user = new models.users(req.body);

  user.save(function(err) {
    if(err) {

      console.log("There was an error:\n" + err);

      if(err.code === 11000){
        //find out which field is duplicated
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
      res.send('Account created successfully. Moving to sign-in page.');
    }
  });
};
