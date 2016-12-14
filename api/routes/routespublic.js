var express = require('express');
var router = express.Router();
var path = require('path');

var ctrlAuthentification = require('../controllers/authentification.controllers.js');

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

router.route('/login').post(ctrlAuthentification.login);
router.route('/content').get(auth, ctrlAuthentification.test);
router.route('/logout').get(ctrlAuthentification.logout);
// router.get('/content', auth, function (req, res) {
//     res.send("You can only see this after you've logged in.");
// });
// router.get('/home.html', auth, function(req, res) {
//   console.log(req);
//   res.sendFile(path.join(__dirname, '../../public', 'home.html'));
// });
// router.get('/logout', function(req, res) {
//   req.session.destroy();
//   res.send("logout success!");
// });

module.exports = router;
