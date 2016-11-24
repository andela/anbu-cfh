//Dependencies
var bodyParser  = require('body-parser');
var jwt    = require('jsonwebtoken');
var key = require('./jwtkey');

var mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function(app){
  app.set('superSecret', key.secret);

  // use body parser to get info from POST and/or URL parameters
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // API ROUTES -------------------

  // route to authenticate a user and create token
  // (POST ./api/auth/login) and (POST ./api/auth/signup)
  var authToken = function(req, res) {
    // find the user
    User.findOne({
      email: req.body.email
    }, function(err, existingUser) {

      if (err) throw err;

      if (!existingUser) {
        res.json({ success: false, message: 'User not found.',
                email: req.body.email });
      } else if (existingUser) {

        // create a token that expires in 24 hours
          var token = jwt.sign(existingUser, app.get('superSecret'), {
            expiresIn: '1440m'
          });

          // return the token as JSON
          res.json({
            token: token
          });

          //Store token in  request body
          req.body.token = token;
      }

    });
  };

  app.post('/api/auth/login', authToken);
  app.post('/api/auth/signup', authToken);



  // route middleware to verify a token
  var checkToken = function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token ||
                req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.json({ success: false,
                    message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });

    }
  };

  // apply the routes to our application with the prefix /api
  app.get('/api', checkToken, function(req, res){
      res.json({ message: 'Welcome to the CFH JWT API' });
  });

};