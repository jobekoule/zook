var express = require('express');
var router = express.Router();
var path = require('path');

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.name)
    return next();
  else
    return res.sendStatus(401);
};

/////////////////////////////////////////
// ROUTER Pour les pages publics
/////////////////////////////////////////

var ctrlAuthentification = require('../controllers/authentification.controllers.js');

router.route('/login').post(ctrlAuthentification.login);
router.route('/content').get(auth, ctrlAuthentification.test);
router.route('/logout').get(ctrlAuthentification.logout);
router.route('/home.html', auth, function(req, res) {
  console.log('aa');
  res.sendFile(path.join(__dirname, '../../public', 'home.html'));
});
// router.get('/home.html', auth, function(req, res) {
//   console.log(req);
//   res.sendFile(path.join(__dirname, '../../public', 'home.html'));
// });

module.exports = router;
