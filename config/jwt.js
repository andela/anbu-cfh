require('dotenv').config();

// Dependencies
var jwt    = require('jsonwebtoken');

var secret = process.env.JWT_KEY;
// Token expiry date
var expiryDate = '1440m'; //24hrs

  // route to authenticate a user and create token
  exports.authToken = function(req, res) {
    // Get the user
    if (req.user) {
      var user = req.user;
      var token = jwt.sign(user, secret, {
        expiresIn: expiryDate
      });

      res.redirect('/#!/token/'+ token);
    }

  };

// route middleware to verify a token
exports.checkToken = function(req, res, next){
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token ||
    req.headers['x-access-token'];
  // decode token
  if(token){
    // verifies secret and checks exp
    jwt.verify(token, secret, (err, decoded) => {
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
