var express = require('express');
var router = express.Router();

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};



var ctrlMembers = require('../controllers/membres.controllers.js');

// Route ajouter un membre
router.route('/membres/add').post(ctrlMembers.add);

router
.route('/login')
.get(ctrlMembers.login);
// router.route('/membres').get(ctrlMembers.test);

module.exports = router;
