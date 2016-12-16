var mongoose = require('mongoose');
var Membres = mongoose.model('Membres');

module.exports.info = function(req, res) {
  res.json(req.session.userID);
}
