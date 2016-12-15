var mongoose = require('mongoose');
var Membres = mongoose.model('Membres');

module.exports.info = function(req, res) {
  console.log(req.session.name);
  res.status(200).json({"msg": "ok"});
}
