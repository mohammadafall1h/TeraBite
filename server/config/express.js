var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    session = require("express-session"),
    passport = require('passport')
    passConfig = require('./passport.js'),
    config = require('./config'),
    functionRouter = require('../routes/routes.js');

module.exports.init = function() {
  //connect to database specified in config.js
  mongoose.connect(config.db.uri);

  //initialize app
  var app = express();

  //activate middleware
  app.use(express.static(path.resolve('./client')));
  app.use(session({ secret: "terabite" }));
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  //use router for calls to /api
  app.use('/api/functions', functionRouter);

  //default to homepage
  app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '../../../client/htmls/map_table_page.html'));
  });

  app.get('/signin', function(req, res){
    res.sendFile(path.join(__dirname + '../../../client/htmls/Login.html'));
  });

  app.get('/signup', function(req, res){
    res.sendFile(path.join(__dirname + '../../../client/htmls/Create.html'));
  });

  app.get('/account', function(req, res){
    res.sendFile(path.join(__dirname + '../../../client/htmls/Create_Event.html'));
  });

  // redirect anything that isnt an pathname specified above
  app.get('*', function(req, res){
      res.redirect('/');
  });

  return app;
};
