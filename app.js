require('./api/data/db.js');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var routesBack = require('./api/routes/routesback.js');
var routesPublic = require('./api/routes/routespublic.js');




// Define the port to run on
app.set('port', 3000);

app.use(session({
    secret: 'supersecret',
    resave: true,
    saveUninitialized: true,
    httpOnly: false,
    secure: false
}));

// Add middleware to console log every request
app.use(function(req, res, next) {
  console.log(req.method, req.url);

  // Si on essai d'accéder à la home sans session
  if(!req.session.name && req.path === '/dashboard.html') {
    res.redirect(302, '/');
    // On redirige vers la connexion
  }

  next();
});

// Set static directory before defining routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/fonts', express.static(__dirname + '/fonts'));

// Enable parsing of posted forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Add some routing
app.use('/api', routesBack);
app.use('/', routesPublic);



// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
