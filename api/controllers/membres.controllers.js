var mongoose = require('mongoose');
var Membres = mongoose.model('Membres');

module.exports.login = function (req, res) {
  if (!req.query.username || !req.query.password) {
    res.send('login failed');
  } else if(req.query.username === "amy" || req.query.password === "amyspassword") {
    req.session.user = "amy";
    req.session.admin = true;
    res.send("login success!");
  }
}
// module.exports.login = function(req, res) {
//   const email = req.body.email;
//   const motdepasse = req.body.motdepasse;
//
//   if(email.length > 0 && motdepasse.length > 0) {
//
//   }
//   else
//     res.status(500).json({error: "-"});
// }

module.exports.add = (req, res) => {
  Membres
      .create({
        nom : req.body.nom,
        email : req.body.email,
        motdepasse : req.body.motdepasse,
        adresse : req.body.adresse
      }, function(err, Membres){
        if(err){
          res
            .status(500)
            .json(err);
        } else {
          res
            .status(201)
            .json(Membres);
        }
      });
};
