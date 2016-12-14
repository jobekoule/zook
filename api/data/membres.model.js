var mongoose = require('mongoose');

var membresSchema = new mongoose.Schema({
  nom :           {type: String, required: true},
  email:          {type: String, required: true},
  motdepasse:     {type: String, required: true},
  adresse:        {type: String, required: true}
});

mongoose.model('Membres', membresSchema);
