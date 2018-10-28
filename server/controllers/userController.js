
/* Dependencies */
var mongoose = require('mongoose'),
  models = require('../models/model.js');

// create new user account
/* TODO:
Figure out if error is caused by duplicate entry for username or password
Figure out which field is being duplicated
tell the response which field is being duplicated
Have a password encryption function that is called before user account is saved to db
*/
exports.create = function(req, res) {

  var user = new models.users(req.body);

  user.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(user);
    }
  });
};
