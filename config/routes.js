const async = require('async');
const secret = process.env.JWT_KEY;
const jwt = require('./jwt');
const index = require('../app/controllers/index');
const users = require('../app/controllers/users');
const questions = require('../app/controllers/questions');
const answers = require('../app/controllers/answers');
const avatars = require('../app/controllers/avatars');
const GameHistory = require('../app/controllers/game-history');

module.exports = function(app, passport, auth) {
  // User Routes
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/chooseavatars', users.checkAvatar);
  app.get('/signout', users.signout);

  // Setting up the users api
  app.post('/users', users.create, jwt.authToken);
  app.post('/users/avatars', users.avatars);

  // Donation Routes
  app.post('/donations', users.addDonation);

  // Authenticate user and generate JWT token
  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Invalid email or password.'
  }), jwt.authToken);

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

  // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Finish with setting up the userId param
  app.param('userId', users.user);

  // Answer Routes
  app.get('/answers', answers.all);
  app.get('/answers/:answerId', answers.show);
  // Finish with setting up the answerId param
  app.param('answerId', answers.answer);

  // Question Routes
  app.get('/questions', questions.all);
  app.get('/questions/:questionId', questions.show);
  // Finish with setting up the questionId param
  app.param('questionId', questions.question);

  // Avatar Routes
  app.get('/avatars', avatars.allJSON);

  // Home route
  app.get('/play', index.play);
  app.get('/', index.render);

  // JWT settings and routes
  app.set('superSecret', secret);
  app.post('/api/auth/login', jwt.authToken);
  app.post('/api/auth/signup', jwt.authToken);
  // apply the routes to our application with the prefix /api
  app.get('/api', jwt.checkToken, (req, res) => {
    res.status(200).json({ message: 'Welcome to the CFH JWT API' });
  });

// Search Route
  const search = require('../app/controllers/searchUser');
  app.get('/api/search/users/:email', search);

  // Send Invite Route
  const sendInvite = require('../app/controllers/sendInvite');
  app.post('/api/send/userinvite', sendInvite);

  // game history
  app.get('/api/games/history', GameHistory.getAllGames);
  app.get('/api/games/:id/history', GameHistory.getGame);
  app.post('/api/games/:id/start', GameHistory.createGame);
  app.put('/api/games/:id/end', GameHistory.updateGame);
};
