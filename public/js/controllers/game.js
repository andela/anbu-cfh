angular.module('mean.system')
.controller('GameController', ['$scope', 'game', '$timeout',
  '$location', '$window', 'MakeAWishFactsService', '$dialog', 'friends',
  function ($scope, game, $timeout, $location, $window, MakeAWishFactsService, $dialog, friends) {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.pickedCards = [];
    let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();
    $scope.chat = game.gameChat;
    $scope.userName = $window.user;

    let notificationsDialog = document.getElementById('notificationsDialog');
    if (!notificationsDialog.showModal) {
      dialogPolyfill.registerDialog(notificationsDialog);
    }
    notificationsDialog.querySelector('.close').addEventListener('click', function() {
      notificationsDialog.close();
    });

    let friendsDialog = document.getElementById('friendsDialog');
    if (!friendsDialog.showModal) {
      dialogPolyfill.registerDialog(friendsDialog);
    }
    friendsDialog.querySelector('.close').addEventListener('click', function() {
      friendsDialog.close();
    });

    // add friends service if user is authenticated
    if ($window.user) {
      $scope.friends = friends;
      $scope.friends.setUserEmail($window.user.email);
      $scope.friends.setUserName($window.user.name);
      // fetch this user friends
      $scope.friends.fetchFriends();
    }

    /**
    * Add a new friend
    * @param{Object} selectedUser
    * @return{undefined}
    */
    $scope.addFriend = (selectedUser) => {
      if (selectedUser) {
        $scope.friends.addFriend(selectedUser.email);
      }
    };

    /**
    * Opens or closes the friends panel
    * Closes the notifications panel
    * @return{undefined}
    */
    $scope.openFriends = () => {
      friendsDialog.showModal();
    };

    /**
    * Opens the notifications panel
    * Closes the friends panel
    * @return{undefined}
    */
    $scope.openNotifications = () => {
      notificationsDialog.showModal();
    };

    /**
    * Delete a notification Item
    * @param{Number} index - Index of the item to be deleted
    * @return{undefined}
    */
    $scope.deleteGameInvite = (index) => {
      $scope.friends.gameInvites.splice(index, 1);
    };

    /**
    * Join invited game
    * @param{String} url - url of the game to join
    * @return{undefined}
    */
    $scope.joinGame = (index, url) => {
      $window.location.href = url;
      $scope.deleteGameInvite(index);
      notificationsDialog.close();
    };

    /**
    * Send in app invite to a friend
    * @param{Object} selectedUser
    * @return{undefined}
    */
    $scope.sendInvite = (selectedUser) => {
      if (selectedUser) {
        $scope.friends
          .sendInAppGameInvite(selectedUser.email, $location.absUrl());
      }
    };


    /**
    * Method to find a friend as the user types
    * @param{String} friendName - name of friend to find
    * @return{undefined}
    */
    $scope.findRegisteredUser = (searchQuery) => {
      $scope.friends.findRegisteredUser(searchQuery);
    };

    let dialog = document.getElementById('showMyDialog');
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    /**
    * Method to scroll the chat thread to the bottom
    * so user can see latest message when messages overflow
    * @return{undefined}
    */
    const scrollChatThread = () => {
      const chatResults = document.getElementById('results');
      if(chatResults){
        chatResults.scrollTop = chatResults.scrollHeight;
      }
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

    $scope.pickCard = function(card) {
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            //delay and send
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
        return {'cursor': 'pointer'};
      } else {
        return {};
      }
    };

    $scope.sendPickedCards = function () {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = function(card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      } else {
        return false;
      }
    };

    $scope.cardIsSecondSelected = function(card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      } else {
        return false;
      }
    };

    $scope.firstAnswer = function($index){
      if($index % 2 === 0 && game.curQuestion.numAnswers > 1){
        return true;
      } else{
        return false;
      }
    };

    $scope.secondAnswer = function($index){
      if($index % 2 === 1 && game.curQuestion.numAnswers > 1){
        return true;
      } else{
        return false;
      }
    };

    $scope.showFirst = function(card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
    };

    $scope.showSecond = function(card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
    };

    $scope.isCzar = function() {
      return game.czar === game.playerIndex;
    };

    $scope.isPlayer = function($index) {
      return $index === game.playerIndex;
    };

    $scope.isCustomGame = function() {
      return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
    };

    $scope.isPremium = function($index) {
      return game.players[$index].premium;
    };

    $scope.currentCzar = function($index) {
      return $index === game.czar;
    };

    $scope.winningColor = function($index) {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      } else {
        return '#f9f9f9';
      }
    };

    $scope.pickWinning = function(winningSet) {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = function() {
      return game.winningCard !== -1;
    };

    $scope.startGame = function () {
      game.startGame();
    };

    $scope.saveGame = function () {
      game.saveGame();
    }
    
    $scope.closeModal = function () {
      $scope.modalInstance.close();
    };

    $scope.abandonGame = function() {
      game.leaveGame();
      $window.location.href = '/#!/play-with';
    };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', function() {
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
    $scope.$watch('game.state', function() {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
    });

    $scope.$watch('game.gameID', function() {
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({game: game.gameID});
          if(!$scope.modalShown){
            setTimeout(function(){
              var link = document.URL;
              var txt = 'Give the following link to your friends so they can join your game: ';
              $('#lobby-how-to-play').text(txt);
              $('#oh-el').css({'text-align': 'center', 'font-size':'22px', 'background': 'white', 'color': 'black'}).text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
      }
    });

    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      game.joinGame('joinGame',$location.search().game);
    } else if ($location.search().custom) {
      game.joinGame('joinGame',null,true);
    } else {
      game.joinGame();
    }

    if ($scope.isCustomGame() && $scope.isCzar) {
      $scope.showDialog = true;
      dialog.showModal();
      dialog.querySelector('.proceed').addEventListener('click', function() {
        dialog.close();
        $scope.saveGame();
      });
    } else {
      document.getElementById('showMyDialog').style.display = 'none';
    }
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
      $window.location.href = '/#!/play-with';
    });
}]);
