var config = require('./config'),
    mongoose = require('mongoose'),
    express = require('./express');

    //sets dynamic ports for heiroku but defaults to localhost:8080
    let port = process.env.PORT;
    if(port == null || port == "") {
      port = 8080;
    }

module.exports.start = function() {
  var app = express.init();
  app.listen(port, function() {
    console.log('App listening on port', port);
  });
};
