angular.module('mean.system')
.controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', '$window', 'friends', function ($scope, Global, $location, socket, game, AvatarService, $window, friends) {
    $scope.global = Global;
    $scope.userName = $window.user;

    let notificationsDialog = document.getElementById('notificationsDialog');
    if (!notificationsDialog.showModal) {
      dialogPolyfill.registerDialog(notificationsDialog);
    }
    notificationsDialog.querySelector('.close').addEventListener('click', function() {
      notificationsDialog.close();
    });

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

    $scope.playAsGuest = function() {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function() {
      if ($location.search().error) {
        return $location.search().error;
      } else {
        return false;
      }
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });
    $scope.userName = $window.user;
}]);