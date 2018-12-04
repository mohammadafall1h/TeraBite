
//const moment = require('moment');
var mongoose = require('mongoose'),
models = require('../models/model.js');
const sendEmail = require('./sendMail');
const loopSeconds = 60;
const warningMinutes = 30;
let providedNotification = false;

function sendNotification(to) 
{
    sendEmail(to, 'Upcoming Event');
}
function loop()
{
  getMailList();
  setTimeout(loop, loopSeconds * 1000);
}

module.exports.timer = function()
{
  loop();
}

function getMailList()
{
  
  var mailList = [];
  
  //console.log("looking for favorites owned");
  models.favorites.find({}).exec(function(err, favs)
   {
    if (err)
    {
      console.log(err);
    } 
    else
     {
      //console.log(favs);
      var favList = [];
      favs.forEach(function(item)
      {
        //console.log("item id:" + item.eventID);
        favList.push(item.eventID);
      });
      //console.log(favList);
      models.events.find({'_id':{'$in':favList}}).exec(function(err,returnList)
      {
        if(err)
        {
          console.log(err);
        } 
        else
        {
          var today = getDay();
          var futureTime = getFutureTime();
          //console.log(returnList);
          var upcomingEvents = [];
          returnList.forEach(function(item)
          {
           // console.log(item.time);
            //console.log(futureTime);
            if(item.date == today && item.time == futureTime)
            {
              //console.log("UPCOMING id:");
              upcomingEvents.push(item._id);
            }
          });
          //console.log(upcomingEvents);

          models.favorites.find({'eventID':{'$in':upcomingEvents}}).exec(function(err,favs)
          {
            if(err)
            {
              console.log(err);
            }
            else
            {
              var userIDs = [];
              favs.forEach(function(item)
              {
                //console.log("USER id:");
                userIDs.push(item.userID);
              });
              //console.log(userIDs);

              models.users.find({'_id':{'$in':userIDs}}).exec(function(err,usrs)
              {
                if(err)
                {
                  console.log(err);
                }
                else
                {
                  usrs.forEach(function(item)
                  {
                    //console.log("USER EMAIL:");
                    mailList.push(item.email);
                  });
                  //console.log(mailList);
                  if(mailList != undefined && mailList.length > 0)
                  {
                    mailList.forEach(function(item)
                    {
                      console.log("calling sendNotification");
                      sendNotification(item);
                    });
                  }
                }
              });
            }
          });
        }
      })
    }
  });
};

function getDay()
{
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  } 
  if (mm < 10) {
    mm = '0' + mm;
  } 
  var today = mm + '/' + dd + '/' + yyyy;
  return today;
}

function getFutureTime()
{
  var today = new Date();
  var h = today.getHours() + 2;

  if(h >= 24)
  {
    h = h - 24;
  }
  if(h < 10)
  {
    h = '0' + h;
  }

  var m = today.getMinutes();

  if(m < 10)
  {
    var futureTime = h + ':0' + m;
  }
  else
  {
    var futureTime = h + ':' + m;
  }
  return futureTime;
}

