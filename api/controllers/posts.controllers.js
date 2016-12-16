var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');

var path = require('path');
var crypto = require('crypto');

module.exports.add = function(req, res) {
  // var postsSchema = new mongoose.Schema({
  //   idMembre:       {type: String, required: true},
  //   date:           {type: Date, required: true},
  //   titre:          {type: String, required: true},
  //   texte:          {type: String, required: true}
  // });
  const titre = req.body.post.titre;
  const texte = req.body.post.texte;

  if(titre.length > 0 && texte.length > 0) {
    if(!req.session.userID) {
      res.status(500).json({"err": "session not present"});
    }
    Posts.create({
      idMembre: req.session.userID,
      dateCreate: Date.now(),
      titre: titre,
      texte: texte
    }, function(err, post) {
      if(err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).json(post);
      }
    });
  }
  else {
    res.json({err: "no text"})
  }
};

module.exports.getAll = function(req, res) {
  // Méthode qui retourne tous les posts d'un zoo
  if(!req.session.userID) {
    res.status(500).json({"err": "session not present"});
  }
  else {
    Posts.
    find({idMembre: req.session.userID}).
    sort({ dateCreate: -1 } ).
    exec(function(err, posts) {
      if(err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).json(posts);
      }
    });
  }
}

module.exports.deleteOne = function(req, res) {
  if(!req.session.userID) {
    res.status(500).json({"err": "session not present"});
  }

  const postID = req.params.postID;

  Posts.
  findOne({
    idMembre: req.session.userID,
    _id: postID
  }).
  exec(function(err, post) {
    if(err) { res.status(500).json(err); }
    else {
      // si on trouve bien le post, que l'id est bon et qu'on est bien le createur
      Posts
      .findByIdAndRemove(postID)
        .exec(function(err, post){
          if (err) {
            res.status(500).json(err);
          } else {
            console.log("Post deleted, id: ", postID);
            res.status(201).json();
          }
        });
    }
  });
  //
  // Posts
  // .findByIdAndRemove(annonceId)
  //   .exec(function(err, annonce){
  //     if (err) {
  //       res
  //         .status(500)
  //         .json(err);
  //     } else {
  //       console.log("Annonce deleted, id: ", annonceId);
  //       res
  //         .status(201)
  //         .json();
  //     }
  //   });
}
