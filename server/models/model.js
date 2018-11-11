/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

/* Create your schema */
var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  isEventCreator: {
    type: Boolean,
    required: true
  },
  org: {
    type: String,
    required: false
  },
  //hashed pw
  hash: {
    type: String,
    required: true
  }
});

userSchema.methods.validatePassword = function validatePassword(pass) {
  return bcrypt.compareSync(pass, this.hash);
};

//event schema
var eventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  date: {
  	type: String,
  	required: true
  },
  time: {
  	type: String,
  	required: true
  },
  food: {
  	type: String,
  	required: true
  },
  description: {
    type: String,
    required: true
  }
});

var favSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  eventID: {
    type: String,
    required: true,
  }
});
eventSchema.index({ address: 1, date: 1 ,time: 1}, { unique: true });
favSchema.index({ userID 1, eventID 1}, { unique: true });

/* Use your schema to instantiate a Mongoose model */
var users = mongoose.model('newUser', userSchema);
var events = mongoose.model('newEvent', eventSchema);
var favorites = mongoose.model('newFavorite', favSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = {
  users: users,
  events: events
  favorites: favorites
}
