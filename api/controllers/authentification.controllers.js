var mongoose = require('mongoose');
var Membres = mongoose.model('Membres');
var path = require('path');


module.exports.login = function (req, res) {
  console.log('aa');
  if (!req.body.email || !req.body.motdepasse) {
    res.send('login failed');
  } else if(req.body.email === "kvn" || req.body.motdepasse === "test") {
    req.session.user = "amy";
    req.session.admin = true;
    // res.send("login success!");
    console.log('Login OK');
    res.redirect(301, '/content')
  }
}

module.exports.logout = function(req, res) {
  req.session.destroy();
  console.log('Logout session');
  res.redirect(301, '/auth.html');
}

module.exports.test = function(req, res, next) {
  res.send("You can only see this after you've logged in.");
}

// module.exports.test = function (req, res) {
//   // Get content endpoint
// app.get('/content', auth, function (req, res) {
//     res.send("You can only see this after you've logged in.");
// });
// }
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
