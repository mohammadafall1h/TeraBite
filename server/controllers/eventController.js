
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
exports.autoDeleteTimer = function(){
  loop();
}
var loopSeconds = 30;
function loop()
{
  autoDelete();
  setTimeout(loop, loopSeconds * 1000);
}
function autoDelete(){
  var date = new Date();
  var currHour = date.getHours();
  var currMin  = date.getMinutes();
  var currTime = currHour + ":" + currMin;
  var cTime = parseTime(currTime);
  var cYear = date.getFullYear();
  var cDay  = date.getDate();
  var cMonth= date.getMonth() + 1;
  //log all current date/time information
  console.log("Current Time Information:\ncTime: " + cTime + "\ncyear: " + cYear + "\ncDay: " + cDay + "\ncMonth: " + cMonth);


  models.events.find({ }).exec(function(err, events) {
    if (err){
      // res.status(400).send(err);
      console.log("An error has occur: "+err);
    } else {
      eList = [];
      events.forEach(function(item){
        //get current event time
        var eTime = parseTime(item.time)+1;
        var edatepostsplit = item.date.split('/');
        var eYear = parseInt(edatepostsplit[2]);
        var eDay = parseInt(edatepostsplit[1]);
        var eMonth = parseInt(edatepostsplit[0]);
        //check if shifting event forward in time changes day
        if(eTime > 24){
          eTime -= 24; //cut the time down 24 hours
          eDay += 1; //move the day forward one
        }
        //check if changing the day should change the month
        if(eMonth == 1 || eMonth == 3 || eMonth == 5 || eMonth == 7 || eMonth == 8 || eMonth == 10 || eMonth == 12 && eDay > 31){
          eDay -= 31;
          eMonth += 1;
        }
        else if(eMonth == 4 || eMonth == 6 || eMonth == 9 || eMonth == 11 && eDay > 30){
          eDay -= 30;
          eMonth += 1;
        }
        else if(eMonth == 2 && eDay > 28){
          eDay -= 28;
          eMonth += 1;
        }
        //check if changing the month should change the year
        if(eMonth > 12){
          eMonth -= 12;
          eYear += 1;
        }

        var timeComp = (cTime - eTime);
        if (cYear > eYear ||
           (cYear == eYear && cMonth > eMonth) ||
           (cYear == eYear && cMonth == eMonth && cDay > eDay) ||
           (cYear == eYear && cMonth == eMonth && cDay == eDay && timeComp > 0)) {
          eList.push(item);
          autoDeleteHelper(item);
        }
      });
      console.log(eList);
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
              //es.status(400).send(err);
            } else {
              // res.send("deleted all the favorites");
              console.log("deleted all events that started at least 60 minutes ago");
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
