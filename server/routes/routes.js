var events = require('../controllers/eventController.js'),
    users = require('../controllers/userController.js'),
    express = require('express'),
    router = express.Router();

/* for calls to /api/functions/login */
//router.route('/login');

/* for calls to /api/functions/user */
router.route('/user')
  .post(users.create);


/* for calls to /api/functions/event */
//router.route('/event');

module.exports = router;
