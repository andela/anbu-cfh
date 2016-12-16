angular.module('mean.system')
.controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', '$window', function ($scope, Global, $location, socket, game, AvatarService, $window) {
    $scope.global = Global;

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