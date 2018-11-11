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

//list all favorites
exports.list = function(req, res) {
  models.favorites.find().exec(function(err, favorites) {
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