var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config');

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
  app.use(express.static(path.resolve('./client/htmls')));
  app.use(express.static(path.resolve('./client/htmls')));
  app.use(express.static(path.resolve('./client/htmls')));

  //default to homepage
  /* UNCOMMENT THIS WHEN WE GET HOMEPAGE IN CLIENT
  app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '../../../client/home.html'));
  });
  */

  app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname + '../../../client/login_page/Login.html'));
  });

  app.get('/signup', function(req, res){
    res.sendFile(path.join(__dirname + '../../../client/create_page/Create.html'));
  });

  // redirect anything that isnt an pathname specified above
  /* UNCOMMENT THIS WHEN WE GET HOMEPAGE IN CLIENT
  app.get('*', function(req, res){
      res.redirect('/');
  });
  */

  return app;
};
