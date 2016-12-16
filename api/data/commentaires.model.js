var mongoose = require('mongoose');

var commentairesSchema = new mongoose.Schema({
  idPost:         {type: String, required: true},
  idMembre:       {type: String, required: true},
  dateCreate:     {type: Date, required: true},
  comment:        {type: String, required: true}
});

mongoose.model('Commentaires', commentairesSchema);
