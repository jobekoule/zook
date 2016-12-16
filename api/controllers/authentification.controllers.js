var mongoose = require('mongoose');
var Membres = mongoose.model('Membres');

var path = require('path');
var crypto = require('crypto');

// module.exports.login = function (req, res) {
//   console.log('aa');
//   if (!req.body.email || !req.body.motdepasse) {
//     res.send('login failed');
//   } else if(req.body.email === "kvn" || req.body.motdepasse === "test") {
//     req.session.user = "amy";
//     req.session.admin = true;
//     console.log('Login OK');
//     res.redirect(301, '/content')
//   }
// }

module.exports.login = function (req, res) {

  if (!req.body.email || !req.body.motdepasse) {
    res.send('login failed');
  } else {
    const email = req.body.email;
    const motdepasse = req.body.motdepasse;
    console.log(req.body);
    Membres.findOne({
      email: email
    }).exec((err, membre) => {
      if(err) {
        res.status(500).json(err);
      }
      else {
        if(membre != null) {
          // Si on trouve un membre avec cet email
          var motdepasseMD5 = crypto.createHash('md5').update(motdepasse).digest("hex");
          console.log(motdepasseMD5);
          console.log(membre.motdepasse);

          if(motdepasseMD5 === membre.motdepasse) {
            req.session.name = membre.nom;
            req.session.userID = membre._id;
            console.log('aaa')
            res.redirect(302, '/dashboard.html');
          }
          else {
            res.redirect(302, '/');
          }
        }
        else {
          // Sinon, on redirect vers la page de connexion
          console.log('Pas de membre pour cet email');
          res.redirect(302, '/');
        }
      }
    });

    // req.session.user = "amy";
    // req.session.admin = true;
    // console.log('Login OK');
    // res.redirect(301, '/content')
  }
}

module.exports.logout = function(req, res) {
  req.session.destroy();
  console.log('Logout session');
  res.redirect(302, '/');
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
        motdepasse : crypto.createHash('md5').update(req.body.motdepasse).digest("hex"),
        adresse : req.body.adresse
      }, function(err, membre){
        if(err){
          res
            .status(500)
            .json(err);
        } else {
          req.session.name = membre.nom;
          req.session.userID = membre._id;
          res.redirect(302, '/dashboard.html');
        }
      });
};
