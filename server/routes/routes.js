var events = require('../controllers/eventController.js'),
    users = require('../controllers/userController.js'),
    login = require('../controllers/loginController.js'),
    favorites = require('../controllers/favController.js'),
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

/* for calls to /api/functions/event */
router.route('/event')
  .get(events.list)
  .post(events.create);

router.route('/event/org')
  .get(events.listByOrganizer);

// router.router('autoDelete')
//   .get(events.autoDelete);

router.route('/favorites')
  .get(favorites.listUserFavs)
  .post(favorites.create);

//params routes
router.route('/event/:eventID')
  .post(events.update)
  .delete(events.delete);

router.route('/favorites/:favID')
  .delete(favorites.delete)

router.param('favID', favorites.favByID);
router.param('eventID', events.eventByID);

module.exports = router;
