var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    functionRouter = require('../routes/routes.js');

module.exports.init = function() {
  //connect to database specified in config.js
  mongoose.connect(config.db.uri);

  //initialize app
  var app = express();

  //enable request logging for development debugging
  app.use(morgan('dev'));
  //body parsing middleware
  app.use(bodyParser.json());

  //Serve client side files like html and css
  app.use(express.static(path.resolve('./client')));

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
