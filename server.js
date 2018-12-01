var app = require('./server/config/app.js');
var server = app.start();
var email = require('./server/email/emailController.js');
var timer = email.timer();
