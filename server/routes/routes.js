var events = require('../controllers/eventController.js'),
    users = require('../controllers/userController.js'),
    login = require('../controllers/loginController.js'),
    express = require('express'),
    passport = require('passport'),
    router = express.Router();

/* for calls to /api/functions/login */
router.route('/login')
  .post(passport.authenticate('local', { successRedirect: '/',
                                         failureRedirect: '/badLogin',})
  )
  .get(login.getUser);

/* for calls to /api/functions/user */
router.route('/user')
  .post(users.create);

/*for calls to /api/functions/event
  similar to bootcamp assignment 4
  need to be able to post and get events */
//router.route('/event');

module.exports = router;
