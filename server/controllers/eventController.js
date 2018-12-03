
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
  models.events.find({ }).exec(function(err, events) {
    if (err){
      res.status(400).send(err);
    } else {
      res.json(events);
    }
  });
};

exports.listByOrganizer = function(req, res){
  var eventOrg = req.user.org;  //get org name from logged in user
  console.log("looking for events owned by " + eventOrg);
  models.events.find({ owner: eventOrg }).exec(function(err, events) {
    if (err){
      res.status(400).send(err);
    } else {
      res.json(events);
    }
  });
}
//time parsing
function parseTime(currTime){
  var strSplit = currTime.split(':');
  var hours = parseInt(strSplit[0]) * 60;
  var mins  = parseInt(strSplit[1]);
  var parseTime = (hours + mins) / 60;
  return parseTime;
}
// autoDelete
exports.autoDelete = function (req,res){
  var date = new Date();
  var currHour = date.getHours();
  var currMin  = date.getMinutes();
  var currTime = currHour + ":" + currMin;
  var ctime = parseTime(currTime);

  var cdate = date.getFullYear();
  var cday  = date.getDate();
  var cmonth= date.getMonth() + 1;


  models.events.find({ }).exec(function(err, events) {
    if (err){
      res.status(400).send(err);
    } else {
      eList = [];
      events.forEach(function(item){
        var eTime = parseTime(item.time);
        var edatepresplit = (item.date);
        var edatepostsplit = edatepresplit.split('/');
        var eYear = parseInt(edatepostsplit[2]);
        var eDay = parseInt(edatepostsplit[1]);
        var eMonth = parseInt(edatepostsplit[0]);
        if (((ctime - eTime) >= .50 && cdate >= eYear && cmonth >= eMonth && cday >= eDay) ||
            ( cdate >= eYear && cmonth >= eMonth && cday > eDay) ||
            ( cdate >= eYear && cmonth > eMonth ) ||
            ( cdate > eYear )) {
          eList.push(item);
          autoDeleteHelper(item);
        }
      });
      res.json(eList);
    }
  });
}

function autoDeleteHelper(currEvent){
  // var event = req.event;
  var eventID = currEvent._id;
  currEvent.remove(function(err){
    if(err){
      console.log(err);
      // res.status(400).send(err);
    }
    else{
      //find all the favorites of this event and delete those too
      models.favorites.find({eventID : eventID}).exec(function(err, favs) {
        if(err){
          console.log(err);
          // res.status(400).send(err);
        } else {
          //loop through all favs and delete them
          var usersDelete = [];
          favs.forEach(function(item){
            usersDelete.push(item._id);
          });
          console.log("deleting: " + favs);
          models.favorites.remove({'_id':{'$in': usersDelete}}).exec(function(err){
            if(err){
              console.log(err);
              res.status(400).send(err);
            } else {
              // res.send("deleted all the favorites");
              console.log("deleted all events that started at least 30 minutes ago");
            }
          }); //end favorites.remove
        }
      }); //end find
    }
  }); //end event.remove
}
// delete an event
exports.delete = function(req, res) {

  var event = req.event;
  var eventID = event._id;
  event.remove(function(err){
    if(err){
      console.log(err);
      res.status(400).send(err);
    }
    else{
      //find all the favorites of this event and delete those too
      models.favorites.find({eventID : eventID}).exec(function(err, favs) {
        if(err){
          console.log(err);
          res.status(400).send(err);
        } else {
          //loop through all favs and delete them
          var usersDelete = [];
          favs.forEach(function(item){
            usersDelete.push(item._id);
          });
          console.log("deleting: " + favs);
          models.favorites.remove({'_id':{'$in': usersDelete}}).exec(function(err){
            if(err){
              console.log(err);
              res.status(400).send(err);
            } else {
              res.send("deleted all the favorites");
            }
          }); //end favorites.remove
        }
      }); //end find
    }
  }); //end event.remove
}; //end delete

exports.update = function(req, res) {
  var event = req.event;

  event.name = req.body.name;
  event.address = req.body.address;
  event.room = req.body.room;
  event.owner = req.body.owner;
  event.date = req.body.date;
  event.time = req.body.time;
  event.food = req.body.food;
  event.description = req.body.description;

  event.save(function(err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(event);
    }
  });
};

exports.eventByID = function(req, res, next, id) {
  models.events.findById(id).exec(function(err, event) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.event = event;
      next();
    }
  });
};
