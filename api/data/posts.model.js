var mongoose = require('mongoose');

var postsSchema = new mongoose.Schema({
  idMembre:       {type: String, required: true},
  date:           {type: Date, required: true},
  titre:          {type: String, required: true},
  texte:          {type: String, required: true}
});

mongoose.model('Posts', postsSchema);
