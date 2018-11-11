
/* Dependencies */
var mongoose = require('mongoose'),
  models = require('../models/model.js');

/* Create an event */
exports.create = function(req, res) {

  var event = new models.events(req.body);
  event.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(event);
    }
  });
};

//list all events
exports.list = function(req, res) {
  models.events.find().exec(function(err, events) {
    if (err){
      res.status(400).send(err);
    } else {
      res.json(events);
    }
  });
};
