var mongoose = require('mongoose');
var Commentaires = mongoose.model('Commentaires');

// var commentairesSchema = new mongoose.Schema({
//   idPost:         {type: String, required: true},
//   idMembre:       {type: String, required: true},
//   dateCreate:     {type: Date, required: true},
//   comment:        {type: String, required: true}
// });
module.exports.getAllForThisPost = function(req, res) {
  const postID = req.query.postID;

  if(postID.length > 0) {
    if(!req.session.userID) {
      res.status(500).json({"err": "session not present"});
    }
    else {
       Commentaires.
       find({idPost: postID}).
       exec(function(err, comments) {
         if(err) {
           res.status(500).json(err);
         }
         else {
           res.status(200).json(comments);
         }
       });
    }
  }
};

module.exports.add = function(req, res) {

  const textComment = req.body.comment;
  const postID = req.body.postID;

  if(textComment.length > 0 && textComment.length > 0 &&
    postID.length > 0 && postID.length > 0) {
    if(!req.session.userID) {
      res.status(500).json({"err": "session not present"});
    }
    Commentaires.create({
      idPost: postID,
      idMembre: req.session.userID,
      dateCreate: Date.now(),
      comment: textComment
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
