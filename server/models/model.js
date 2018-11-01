/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
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

userSchema.methods.validatePassword = function(pass) {
  return bcrypt.compareSync(pass, this.hash);
};


userSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

userSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
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
  	type: Date,
  	required: true
  },
  time: {
  	type: Number,
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
eventSchema.index({ address: 1, date: 1 ,time: 1}, { unique: true });

/* Use your schema to instantiate a Mongoose model */
var users = mongoose.model('newUser', userSchema);
var events = mongoose.model('newEvent', eventSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = {
  users: users,
  events: events
}
