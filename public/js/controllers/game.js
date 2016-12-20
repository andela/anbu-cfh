/* eslint-disable */
angular.module('mean.system')
  .controller('GameController', ['$scope', 'game', '$http', '$timeout',
    '$location', 'MakeAWishFactsService', '$dialog',
    function ($scope, game, $http, $timeout, $location, MakeAWishFactsService, $dialog) {
      $scope.hasPickedCards = false;
      $scope.winningCardPicked = false;
      $scope.showTable = false;
      $scope.modalShown = false;
      $scope.game = game;
      $scope.pickedCards = [];
      let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      $scope.makeAWishFact = makeAWishFacts.pop();
      $scope.numberOfInvites = 0;
      $scope.invitedPlayersList = [];
      $scope.checkExist = true;
      $scope.chat = game.gameChat;

      /**
      * Method to scroll the chat thread to the bottom
      * so user can see latest message when messages overflow
      * @return{undefined}
      */
      const scrollChatThread = () => {
        const chatResults = document.getElementById('results');
        chatResults.scrollTop = chatResults.scrollHeight;
      };

      $scope.$watchCollection('chat.messageArray', (newValue, oldValue) => {
        $timeout(() => {
          scrollChatThread();
        }, 100);
      });

      /**
      * Method to send messages
      * @param{String} userMessage - String containing the message to be sent
      * @return{undefined}
      */
      $scope.sendMessage = (userMessage) => {
        $scope.chat.postGroupMessage(userMessage);
        $scope.chatMessage = '';
      };
      
      $scope.pickCard = function (card) {
        if (!$scope.hasPickedCards) {
          if ($scope.pickedCards.indexOf(card.id) < 0) {
            $scope.pickedCards.push(card.id);
            if (game.curQuestion.numAnswers === 1) {
              $scope.sendPickedCards();
              $scope.hasPickedCards = true;
            } else if (game.curQuestion.numAnswers === 2 &&
              $scope.pickedCards.length === 2) {
              // delay and send
              $scope.hasPickedCards = true;
              $timeout($scope.sendPickedCards, 300);
            }
          } else {
            $scope.pickedCards.pop();
          }
        }
      };
      $scope.keyPressed = function ($event) {
        const keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
          $scope.sendMessage($scope.chatMessage);
        }
      };

      $scope.showChat = function () {
        $scope.chat.chatWindowVisible = !$scope.chat.chatWindowVisible;
        // enableChatWindow;
        if ($scope.chat.chatWindowVisible) {
          $scope.chat.unreadMessageCount = 0;
        }
      };

      $scope.pointerCursorStyle = function () {
        if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
          return { 'cursor': 'pointer' };
        } else {
          return {};
        }
      };

      $scope.sendPickedCards = function () {
        game.pickCards($scope.pickedCards);
        $scope.showTable = true;
      };

      $scope.cardIsFirstSelected = function (card) {
        if (game.curQuestion.numAnswers > 1) {
          return card === $scope.pickedCards[0];
        } else {
          return false;
        }
      };

      $scope.cardIsSecondSelected = function (card) {
        if (game.curQuestion.numAnswers > 1) {
          return card === $scope.pickedCards[1];
        } else {
          return false;
        }
      };

      $scope.firstAnswer = function ($index) {
        if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.secondAnswer = function ($index) {
        if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.showFirst = function (card) {
        return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
      };

      $scope.showSecond = function (card) {
        return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
      };

      $scope.isCzar = function () {
        return game.czar === game.playerIndex;
      };

      $scope.isPlayer = function ($index) {
        return $index === game.playerIndex;
      };

      $scope.isCustomGame = function () {
        return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
      };

      $scope.isPremium = function ($index) {
        return game.players[$index].premium;
      };

      $scope.currentCzar = function ($index) {
        return $index === game.czar;
      };

      $scope.winningColor = function ($index) {
        if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
          return $scope.colors[game.players[game.winningCardPlayer].color];
        } else {
          return '#f9f9f9';
        }
      };

      $scope.pickWinning = function (winningSet) {
        if ($scope.isCzar()) {
          game.pickWinning(winningSet.card[0]);
          $scope.winningCardPicked = true;
        }
      };

      $scope.winnerPicked = function () {
        return game.winningCard !== -1;
      };

      $scope.abandonGame = function () {
        game.leaveGame();
        $location.path('/');
      };

//   Controllers for Min and Max Dialogs
      var minModal = document.getElementById('minAlertModal');
      if (! minModal.showModal) {
        dialogPolyfill.registerDialog(minModal);
      }
      var maxModal = document.getElementById('maxAlertModal');
      if (! maxModal.showModal) {
        dialogPolyfill.registerDialog(maxModal);
      }

      minModal.querySelector('.close').addEventListener('click', function() {
        minModal.close();
      });
       maxModal.querySelector('.close').addEventListener('click', function() {
        maxModal.close();
      });


    $scope.startGame = function () {
      if (game.players.length >= game.playerMinLimit) {
        game.startGame();
      } else {
        minModal.showModal();
      }

    };
      // Catches changes to round to update when no players pick card
      // (because game.state remains the same)
      $scope.$watch('game.round', function () {
        $scope.hasPickedCards = false;
        $scope.showTable = false;
        $scope.winningCardPicked = false;
        $scope.makeAWishFact = makeAWishFacts.pop();
        if (!makeAWishFacts.length) {
          makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
        }
        $scope.pickedCards = [];
      });

      // In case player doesn't pick a card in time, show the table
      $scope.$watch('game.state', function () {
        if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
          $scope.showTable = true;
        }
      });

      $scope.gameState = {
        awaitingPlayers: function() {
          return $scope.game.state === 'awaiting players';
        },
        ended: function() {
          return $scope.game.state === 'game ended';
        },

        dissolved: function() {
          return $scope.game.state === 'game dissolved';
        },

        awaitingCzar: function() {
          return $scope.game.state === 'waiting for czar to decide';
        },

        winnerChosen: function() {
          return $scope.game.state === 'winner has been chosen';
        },

        noWinner: function() {
          return game.gameWinner === -1;
        },
        userWon: function() {
          return game.gameWinner === game.playerIndex;
        },
        userLost: function() {
          return game.gameWinner !== game.playerIndex;
        }
      };


      $scope.$watch('game.gameID', function () {
        if (game.gameID && game.state === 'awaiting players') {
          if (!$scope.isCustomGame() && $location.search().game) {
            // If the player didn't successfully enter the request room,
            // reset the URL so they don't think they're in the requested room.
            $location.search({});
          } else if ($scope.isCustomGame() && !$location.search().game) {
            // Once the game ID is set, update the URL if this is a game with friends,
            // where the link is meant to be shared.
            $location.search({ game: game.gameID });
            if (!$scope.modalShown) {
              setTimeout(function () {
                var link = document.URL;
                // var txt = 'Give the following link to your friends so they can join your game: ';
                // $('#lobby-how-to-play').text(txt);
                // $('#oh-el').css({ 'text-align': 'center', 'font-size': '22px', 'background': 'white', 'color': 'black' }).text(link);
                //$('#lobby-how-to-play').html("<button class='btn btn-info btn-lg' data-toggle='modal' data-target='#searchModal'> Invite Friends</button>");
              }, 200);
              $scope.modalShown = true;
            }
          }
        }
      });

      if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
        console.log('joining custom game');
        game.joinGame('joinGame', $location.search().game);
      } else if ($location.search().custom) {
        game.joinGame('joinGame', null, true);
      } else {
        game.joinGame();
      }
      //Definition for Search and Invite Dialog
      var dialog = document.getElementById('searchModal');
      var showDialogButton = document.querySelector('#invite-friends-button');
      if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }
      showDialogButton.addEventListener('click', function() {
        dialog.showModal();
      });
      dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
      });
    
    
    // $scope.showSearchDialog = () => {
      

    // }

    $scope.searchDB = (searchString) => {
      console.log(searchString);
      $scope.searchResult = [];
      $http.get('/api/search/users/' + searchString)
        .success((res) => {
          $scope.items = res;
        })
        .error((err) => {
          console.log(err);
        });
    }
    $scope.sendInvite = (email, name) => {
      console.log(email, name, 'testfrom angulars')
      if ($scope.numberOfInvites < game.playerMaxLimit - 1) {
        if ($scope.invitedPlayersList.indexOf(email) === -1) {
          $scope.invitedPlayersList.push(email);
          console.log($scope.invitedPlayersList);
          $http.post('/api/send/userinvite', { 'email': email, 'name': name, 'link': document.URL })
            .success((res) => {
              console.log(res);
            })
            .error((err) => {
              console.log(err);
            });
          $scope.numberOfInvites += 1;
        
        } else {
          console.log('User Already Invited');
        }
      } else {
        maxModal.showModal();
      }
      console.log($scope.numberOfInvites, game.playerMaxLimit)
    }
    $scope.checkPlayer = (email) => {
      if ($scope.invitedPlayersList.indexOf(email) === -1) {
        return true;
      } else {
        return false;
      }
    };

const demodata =
      [
        {
          gameID: 33333,
          players: ['oreoluwa@gmail.com', 'hound@hound.com', 'wale@wale.com'],
          rounds: 20,
          winner: 'hound@hound.com',
          gamedate: Date.now()
        },
        {
          gameID: 333553,
          players: ['oreoluwa@ymail.com', 'hound@hound.com', 'wale@wale.com'],
          rounds: 19,
          winner: 'wale@wale.com',
          gamedate: Date.now()
        },
        {
          gameID: 34433,
          players: ['oreoluwa@gmail.com', 'hound@hound.com', 'wale@wale.com'],
          rounds: 24,
          winner: 'oreoluwa@yahoo.com',
          gamedate: Date.now()
        }
      ];

    $scope.gamelogshow = false;
    $scope.displayfriends = false;

    $scope.gameLog = () => {
      if (!$scope.gamelogshow) {
        console.log('Yay it works');
        $scope.gamelogshow = true;
        $scope.allGames = demodata;
        return demodata;
      }
      $scope.gamelogshow = false;


    };

}]);
