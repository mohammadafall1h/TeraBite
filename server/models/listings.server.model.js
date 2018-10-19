/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Create your schema */
var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  }
  pass: {
    type: String,
    required: true
  }
  isEventCreator: {
    type: Boolean,
    required: true
  }
});

var eventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: String
  coordinates: {
    latitude: Number,
    longiude: Number
  },
  owner: {
    type: String,
    required: true
  }
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property
listingSchema.pre('save', function(next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if(!this.created_at)
  {
    this.created_at = currentTime;
  }
  next();
}); */

/* Use your schema to instantiate a Mongoose model */
var users = mongoose.model('newUser',userSchema );
var events = mongoose.model('newEvent',eventSchema );

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = users;
module.exports = events;
