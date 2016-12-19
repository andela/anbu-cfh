angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService','LocalStorage', '$routeParams', '$window',
    function ($scope, Global, $location, socket, game, AvatarService, LocalStorage, $routeParams, $window) {
    $scope.global = Global;

    // Save Token if created
    if ($routeParams.token) {
      LocalStorage.storeToken('token', $routeParams.token);
      $location.path('/play-with');
    }

    // Delete token when user signs Out
    if ($routeParams.remove) {
      LocalStorage.clearToken('token');
      $location.path('/');
    }

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

