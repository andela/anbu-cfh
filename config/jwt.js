require('dotenv').config();

// Dependencies
var jwt    = require('jsonwebtoken');

var secret = process.env.JWT_KEY;
// Token expiry date
var expiryDate = '1440m'; //24hrs

var mongoose = require('mongoose'),
  User = mongoose.model('User');
  // route to authenticate a user and create token
  // (POST ./api/auth/login) and (POST ./api/auth/signup)
  exports.authToken = function(req, res) {
    // find the user
    User.findOne({
      email: req.body.email
    }, function(err, existingUser){
      if (err) throw err;
      if (!existingUser) {
        res.status(403).json({
          message: 'User not found.',
          email: req.body.email });
      } else if (existingUser){
        // Create the token
        var token = jwt.sign(existingUser, secret, {
          expiresIn: expiryDate
        });
        // return the token as JSON
        res.status(200).json({
          token: token
        });
      }
    });
  };

  // route middleware to verify a token
  exports.checkToken = function(req, res, next){
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token ||
      req.headers['x-access-token'];
    // decode token
    if(token){
      // verifies secret and checks exp
      jwt.verify(token, app.get('superSecret'), (err, decoded) => {
        if (err) {
          return res.status(403).json({
            message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    }
    else{
      // if there is no token
      // return an error
      return res.status(403).send({
        message: 'No token provided.'
      });
    }
  };


