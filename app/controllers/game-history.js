const gameHistory = require('../models/game-history.js');

/*
* Create New Game Record
*/
exports.createGame = (request, response) => {
  const game = new gameHistory();
  game.gameID = request.body.gameID;
  game.creator = request.body.creator;
  game.players = request.body.players;
  game.rounds = request.body.rounds;
  game.winner = request.body.winner;
  game.ended = request.body.ended;
  
  game.save((error, data) => {
    if(error) response.send(error);
    response.status(201).json(data);
  });
};


/*
* Update Game Record
*/
exports.updateGame = (request, response) => {
  gameHistory.update({
    gameID: request.body.gameID
  }, {
    $set: {
      ended: request.body.ended,
      rounds: request.body.rounds,
      winner: request.body.winner
    }
  }, (error, data) => {
    if(error) response.send(error);
    response.status(201).json(data);
  });
}

/*
* Find Game Records by id
*/
exports.getGame = (request, response) => {
  gameHistory.findOne({
    gameID: request.params.id
  }, (error, savedGame) => {
    if (error) {
      response.send(error);
    }
    if (!savedGame) {
      response.status(400).json({
        success: false,
        message: 'Game Record Not Found!!'
      });
    } else {
      response.status(200).json(savedGame);
    }
  })
}

/*
* Find Game Records by id
*/
exports.getAllGames = (request, response) => {
  gameHistory.find({}, (error, savedGames) => {
    if (error) {
      response.send(error);
    }
    if (!savedGames) {
      response.status(400).json({
        success: false,
        message: 'No Game Record Available!!'
      });
    } else {
      response.status(200).json(savedGames);
    }
  })
}
