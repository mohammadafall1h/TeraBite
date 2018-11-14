var mongoose = require('mongoose'),
  models = require('../models/model.js');

/* Create an event */
exports.create = function(req, res) {

  var favorite = new models.favorites(req.body);
  favorite.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(favorite);
    }
  });
};

//list all favorites of logged in user
exports.listUserFavs = function(req, res) {
  id = req.user._id;  //get ID from logged in user
  console.log("looking for favorites owned by " +  id);
  models.favorites.find({ userID: id }).exec(function(err, favorites) {
    if (err){
      res.status(400).send(err);
    } else {
      res.json(favorites);
    }
  });
};

//delete a favorite
exports.delete = function(req, res) {
  var favorite = req.favorite;

  favorite.remove(function(err){
    if(err){
      console.log(err);
      res.status(400).send(err);
    }
    else{
      res.end();
    }
  })
};

exports.favByID = function(req, res, next, id) {
  models.events.findById(id).exec(function(err, favorite) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.favorite = favorite;
      next();
    }
  });
};
