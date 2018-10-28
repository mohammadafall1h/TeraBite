
/* Dependencies */
// TODO: I think we need separate models for events and users
var mongoose = require('mongoose'),
  userModel = require('../models/model.js');

/*
Please go over everything, the stuff I labeled as need to fix is what I know is wrong
most other things I think i did right but still want
a second pair of eyes to look at it yknow


Things to fix:

*/

// not sure what to add for the login
// will keep it commented for now
// exports.login = function(req,res) {
//
// }

// create user 
exports.create = function(req, res) {

  var user = new userModel(req.body);
  event.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(user);
    }
  });
};

exports.read = function(req, res) {
  res.json(req.user);
};

exports.update = function(req, res) {
  var user = req.user;

  user.email = req.body.email;
  user.username = req.body.username;
  user.pass = req.body.pass;
  user.isEventCreator = req.body.isEventCreator;
  user.org = req.body.org;


  user.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(user);
    }
  });

};

/* Delete a listing */
exports.delete = function(req, res) {
 
  var user = req.user;

  user.remove(function (err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.end();
    }
  })
};

/* I don't think we need to list users?
I am commenting this out for now  */
// exports.list = function(req, res) {
//   /** TODO **/
//   /* Your code here */
//   eventModel.find().sort('name').exec(function(err, events) {
//     if (err) {
//       res.status(400).send(err);
//     } else {
//       res.json(events);
//     }
//   })
// };

/*
  Middleware: find a listing by its ID, then pass it to the next request handler.

  Find the listing using a mongoose query,
        bind it to the request object as the property 'listing',
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  userModel.findById(id).exec(function(err, user) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.user = user;
      next();
    }
  });
};
