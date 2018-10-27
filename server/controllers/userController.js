
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

/* Create an event */
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
  var user = req.user`;

  // NEEDS TO BE FIXED
  // not sure what the exact html equivalents are
  // please fix these
  user.email = ;
  user.username = ;
  user.pass = ;
  user.isEventCreator =;
  user.org = ;


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
  // need to account for multiple
  // events having the same name
  // maybe cross check against owner of event and name?
  var user = req.user.email;

  user.remove(function (err) {
    if (err) {
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
