/* eslint-disable no-undef, indent, max-len, prefer-const,*/
/* eslint-disable no-unused-vars, object-shorthand, func-names */
angular.module('mean.system')
    .controller('GameController', ['$scope', 'game', '$http', '$timeout',
        '$location', '$window', 'MakeAWishFactsService', '$dialog', 'friends', 'Storage',
        function($scope, game, $http, $timeout, $location, $window, MakeAWishFactsService, $dialog, friends, Storage) {
            $scope.hasPickedCards = false;
            $scope.winningCardPicked = false;
            $scope.showTable = false;
            $scope.modalShown = false;
            $scope.game = game;
            $scope.pickedCards = [];
            let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
            $scope.makeAWishFact = makeAWishFacts.pop();
            $scope.chat = game.gameChat;
            $scope.userName = Storage.get('user');
            $scope.numberOfInvites = 0;
            $scope.invitedPlayersList = [];
            $scope.checkExist = true;

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
            if ($scope.userName) {
                $scope.friends = friends;
                $scope.friends.setUserEmail($scope.userName.email);
                $scope.friends.setUserName($scope.userName.name);
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
                if (chatResults) {
                    chatResults.scrollTop = chatResults.scrollHeight;
                }
            };

            $scope.$watchCollection('chat.messageArray', (newValue, oldValue) => {
                $timeout(() => {
                    scrollChatThread();
                }, 100);
            });

             $scope.gameState = {
                awaitingPlayers: function () {
                    return $scope.game.state === 'awaiting players';
                },

                ended: function () {
                    return $scope.game.state === 'game ended';
                },

                dissolved: function () {
                    return $scope.game.state === 'game dissolved';
                },

                awaitingCzar: function () {
                    return $scope.game.state === 'waiting for czar to decide';
                },

                winnerChosen: function () {
                    return $scope.game.state === 'winner has been chosen';
                },

                noWinner: function () {
                    return game.gameWinner === -1;
                },
                userWon: function () {
                    return game.gameWinner === game.playerIndex;
                },
                userLost: function () {
                    return game.gameWinner !== game.playerIndex;
                }
            };

            /**
             * Method to send messages
             * @param{String} userMessage - String containing the message to be sent
             * @return{undefined}
             */
            $scope.sendMessage = (userMessage) => {
                $scope.chat.postGroupMessage(userMessage);
                document.getElementsByClassName('emoji-wysiwyg-editor')[0].innerHTML = '';
            };

            $scope.pickCard = (card) => {
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
            $scope.keyPressed = ($event) => {
                const keyCode = $event.which || $event.keyCode;
                if (keyCode === 13) {
                    $scope.sendMessage($scope.chatMessage);
                }
            };

            $scope.showChat = () => {
                $scope.chat.chatWindowVisible = !$scope.chat.chatWindowVisible;
                // enableChatWindow;
                if ($scope.chat.chatWindowVisible) {
                    $scope.chat.unreadMessageCount = 0;
                }
            };

            $scope.pointerCursorStyle = () => {
                if ($scope.isCzar() && $scope.game.state ===
                    'waiting for czar to decide') {
                    return { cursor: 'pointer' };
                }
                return {};
            };

            $scope.sendPickedCards = () => {
                game.pickCards($scope.pickedCards);
                $scope.showTable = true;
            };

            $scope.cardIsFirstSelected = (card) => {
                if (game.curQuestion.numAnswers > 1) {
                    return card === $scope.pickedCards[0];
                }
                return false;
            };

            $scope.cardIsSecondSelected = (card) => {
                if (game.curQuestion.numAnswers > 1) {
                    return card === $scope.pickedCards[1];
                }
                return false;
            };

            $scope.firstAnswer = ($index) => {
                if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
                    return true;
                }
                return false;
            };

            $scope.secondAnswer = ($index) => {
                if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
                    return true;
                }
                return false;
            };

            $scope.showFirst = card => game.curQuestion.numAnswers > 1 &&
                $scope.pickedCards[0] === card.id;

            $scope.showSecond = card => game.curQuestion.numAnswers > 1 &&
                $scope.pickedCards[1] === card.id;

            $scope.isCzar = () => game.czar === game.playerIndex;

            $scope.isPlayer = $index => $index === game.playerIndex;

            $scope.isCustomGame = () => !(/^\d+$/).test(game.gameID) &&
                game.state === 'awaiting players';

            $scope.isPremium = $index => game.players[$index].premium;

            $scope.currentCzar = $index => $index === game.czar;

            $scope.winningColor = ($index) => {
                if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
                    return $scope.colors[game.players[game.winningCardPlayer].color];
                }
                return '#f9f9f9';
            };

            $scope.pickWinning = (winningSet) => {
                if ($scope.isCzar()) {
                    game.pickWinning(winningSet.card[0]);
                    $scope.winningCardPicked = true;
                }
            };

            $scope.winnerPicked = () => game.winningCard !== -1;

            //   Definitions for Min and Max Dialogs
              var minModal = document.getElementById('minAlertModal');
              if (!minModal.showModal) {
                dialogPolyfill.registerDialog(minModal);
              }
              var maxModal = document.getElementById('maxAlertModal');
              if (!maxModal.showModal) {
                dialogPolyfill.registerDialog(maxModal);
              }

              minModal.querySelector('.close').addEventListener('click', function() {
                minModal.close();
              });
              maxModal.querySelector('.close').addEventListener('click', function() {
                maxModal.close();
              });

              //Definition for Search and Invite Dialog
              var searchDialog = document.getElementById('searchModal');
              var showDialogButtonDesktop = document.querySelector('#invite-players-button-desktop');
              var showDialogButtonMobile = document.querySelector('#invite-players-button-mobile');
              if (!searchDialog.showModal) {
                dialogPolyfill.registerDialog(searchDialog);
              }
              showDialogButtonDesktop.addEventListener('click', function() {
                searchDialog.showModal();
              });
              showDialogButtonMobile.addEventListener('click', function() {
                searchDialog.showModal();
              });

              searchDialog.querySelector('.close').addEventListener('click', function() {
                searchDialog.close();
              });

               //Definition for Game History Modal
                var gameHistoryModal = document.getElementById('gameHistoryModal');
                if (! gameHistoryModal.showModal) {
                    dialogPolyfill.registerDialog(gameHistoryModal);
                }

                gameHistoryModal.querySelector('.close').addEventListener('click', function() {
                    gameHistoryModal.close();
                });

            $scope.startGame = function () {
              if (game.players.length >= game.playerMinLimit) {
                game.startGame();
              } else {
                minModal.showModal();
              }
            };

            $scope.saveGame = () => {
                game.saveGame();
            };

            $scope.closeModal = () => {
                $scope.modalInstance.close();
            };

            $scope.abandonGame = () => {
                game.leaveGame();
                $window.location.href = '/#!/play-with';
            };


            // Catches changes to round to update when no players pick card
            // (because game.state remains the same)
            $scope.$watch('game.round', () => {
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
            $scope.$watch('game.state', () => {
                if (game.state === 'waiting for czar to decide' &&
                    $scope.showTable === false) {
                    $scope.showTable = true;
                }
            });

            $scope.$watch('game.gameID', () => {
                if (game.gameID && game.state === 'awaiting players') {
                    if (!$scope.isCustomGame() && $location.search().game) {
                        // If the player didn't successfully enter the request room,
                        // reset the URL so they don't think they're in the requested room.
                        $location.search({});
                    } else if ($scope.isCustomGame() && !$location.search().game) {
                        // Once the game ID is set, update the URL
                        // if this is a game with friends,
                        // where the link is meant to be shared.
                        $location.search({ game: game.gameID });
                        if (!$scope.modalShown) {
                            setTimeout(() => {
                                const link = document.URL;
                            }, 200);
                            $scope.modalShown = true;
                        }
                    }
                }
            });

            if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
                if ($scope.userName) {
                    game.joinGame('joinGame', $location.search().game);
                } else { $window.location.href = '/#!/signup'; }
            } else if ($location.search().custom) {
                game.joinGame('joinGame', null, true);
            } else {
                game.joinGame();
            }
            if ($scope.isCustomGame() && $scope.isCzar) {
                $scope.showDialog = true;
                dialog.showModal();
                dialog.querySelector('.proceed').addEventListener('click', () => {
                    dialog.close();
                    $scope.saveGame();
                });
            } else {
                document.getElementById('showMyDialog').style.display = 'none';
            }
            dialog.querySelector('.close').addEventListener('click', () => {
                dialog.close();
                $window.location.href = '/#!/play-with';
            });

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
            };

            $scope.sendMailInvite = (email, name) => {
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

            $scope.displayfriends = false;

            $scope.gameLog = () => {
                $http({
                    method: 'GET',
                    url: `/api/games/history/${window.user.email}`
                    })
                    .then(function successCallback(response) {
                    console.log(response.data)
                    $scope.allGames = response.data
                    console.log(typeof($scope.allGames));
                    }, function errorCallback(response) {

                });
                    gameHistoryModal.showModal();
                };
                $scope.regexx = /\d+-\d+-\d+/;
        }
    ]);

