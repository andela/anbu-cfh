const gameHistory = require('../models/game-history.js');

/*
 * Create New Game Record
 */
exports.createGame = (request, response) => {
  const game = new gameHistory();
  game.gameID = request.params.id;
  game.creator = request.body.creator;
  game.players = request.body.players;
  game.rounds = request.body.rounds;
  game.winner = request.body.winner;
  game.ended = request.body.ended;
  game.save((error, data) => {
    if (error) {
      response.status(400)
        .json(error);
    }
    response.status(201)
      .json(data);
  });
};


/*
 * Update Game Record
 */
exports.updateGame = (request, response) => {
  const gameCreator = request.body.creator;
  const gameId = request.params.id;
  const query = {
    $and: [
      { gameID: gameId }, { creator: gameCreator }
    ]
  };
  gameHistory.update(query, {
    winner: request.body.winner,
    completed: request.body.ended,
    rounds: request.body.rounds
  }, (error, result) => {
    if (error) {
      return response.status(500)
        .json({ message: 'An error occured while updating this data' });
    }
    return response.status(200)
      .json({ message: 'Game updated sucessfully', result });
  });
};

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
      response.status(400)
        .json({
          success: false,
          message: 'Game Record Not Found!!'
        });
    } else {
      response.status(200)
        .json(savedGame);
    }
  });
};

/*
 * Find Game Records by id
 */
exports.getAllGames = (request, response) => {
  gameHistory.find({}, (error, savedGames) => {
    if (error) {
      response.status(404)
        .json(error);
    }
    if (!savedGames) {
      response.status(400)
        .json({
          success: false,
          message: 'No Game Record Available!!'
        });
    } else {
      response.status(200)
        .json(savedGames);
    }
  });
};
