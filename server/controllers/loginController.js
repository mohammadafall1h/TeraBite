/* Dependencies */
var mongoose = require('mongoose'),
  models = require('../models/model.js');

exports.getUser = function(req, res){
  //user exists in the request header (persistent login detected)
  if(req.user){
    console.log(req.user);
    res.json(req.user);
  }
  //user is not logged in
  else{
    console.log('No user currently logged in.');
    res.send('No User');
  }
}
