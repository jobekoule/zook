var express = require('express');
var router = express.Router();

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.name)
    return next();
  else
    return res.sendStatus(401);
};

/////////////////////////////////////////
// ROUTER Pour les pages back
/////////////////////////////////////////

var ctrlPosts = require('../controllers/posts.controllers.js');
router.route('/posts').
  post(auth, ctrlPosts.add).
  get(auth, ctrlPosts.getAll);

router.route('/posts/:postID').delete(ctrlPosts.deleteOne);


var ctrlMembres = require('../controllers/membres.controllers.js');
router.route('/membres').get(auth, ctrlMembres.info);

module.exports = router;
