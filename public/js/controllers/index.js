angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', '$window', 'friends', 'Storage', '$routeParams', '$timeout',
    function ($scope, Global, $location, socket, game, AvatarService, $window, friends, Storage, $routeParams, $timeout) {
      $scope.global = Global;
      $scope.userName = Storage.get('user');
      $scope.clearAvatarStorage = () => {
        return Storage.clear('user');
      };
      if (!$scope.userName && $location.path() == '/choose-avatar') {
        $window.location.href = '/#!/signin';
      }
      $scope.friends = friends;
      $scope.showme = false;
      let avatarDiv = document.getElementById('contain-avatars');
      if (document.getElementById('revealAvatars')) {
        document.getElementById('revealAvatars')
          .addEventListener('click', () => {
            $scope.showme === false ?
              (avatarDiv.style.display = 'block', $scope.showme = true) :
              (avatarDiv.style.display = 'none', $scope.showme = false);
          });
      }
      $scope.showAvatarsDiv = ($event) => {
        $event.currentTarget.childNodes[1].checked = true;
        $timeout(() => {
          avatarDiv.style.display = 'none';
          $scope.showme = false;
        }, 1000);
      };

      let notificationsDialog = document.getElementById('notificationsDialog');
      if (notificationsDialog) {
        if (!notificationsDialog.showModal) {
          dialogPolyfill.registerDialog(notificationsDialog);
        }
        notificationsDialog.querySelector('.close').addEventListener('click', function () {
          notificationsDialog.close();
        });
      }

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

      if (window.user && !Storage.get('user')) {
        Storage.set('user', window.user);
      }
      // Save Token if created
      if ($routeParams.token) {
        Storage.set('token', $routeParams.token);
        $location.path('/play-with');
      }

      $scope.playAsGuest = function () {
        game.joinGame();
        $location.path('/app');
      };

      $scope.showError = function () {
        if ($location.search().error) {
          return $location.search().error;
        } else {
          return false;
        }
      };
      $scope.avatars = [];
      AvatarService.getAvatars()
        .then(function (data) {
          $scope.avatars = data;
        });
      $scope.userName = Storage.get('user');
    }
  ]);
