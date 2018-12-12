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

  app.get('/favicon.ico', function(req,res){
    res.sendFile(path.join(__dirname + '../../../client/images/terabiteLogo.png'));
  });

  app.get('/signin', function(req, res){
    res.sendFile(path.join(__dirname + '../../../client/htmls/Login.html'));
  });

  // this is got when failureRedirect happens in passport authentication
  app.get('/badLogin',function(req,res){
    res.send("incorrect_login");
  })

  app.get('/signup', function(req, res){
    res.sendFile(path.join(__dirname + '../../../client/htmls/Create.html'));
  });

  app.get('/account', verifyLogin, function(req, res){
    res.sendFile(path.join(__dirname + '../../../client/htmls/Create_Event.html'));
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  // redirect anything that isnt an pathname specified above
  app.get('*', function(req, res){
      res.redirect('/');
  });

  return app;
};

/* MIDDLEWARE FUNCTIONS */

//middleware used to block access to a route unless the user is logged in
var verifyLogin = function(req, res, next){
  //user exists in the request header (persistent login detected)
  if(req.user){
    next();
  }
  //user is not logged in
  else{
    console.log('Blocked attempt to access a webpage or api.');
    res.send(401, "Not Logged In");
  }
}
