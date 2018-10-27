var events = require('../controllers/eventController.js'),
    users = require('../controllers/userController.js'),
    express = require('express'),
    router = express.Router();

//not sure what to do here
router.route('/login')
  .get(users.login);

router.route('/user')
  .get(users.create);


router.route('/event')
  .get(events.create);


//not sure if we need this but I will add it
router.param('listingId',events.listingByID);
router.param('listingByID',users.listingByID);

module.exports = router;
