angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService','Storage', '$routeParams',
    function ($scope, Global, $location, socket, game, AvatarService, Storage, $routeParams) {
    $scope.global = Global;
      $scope.playAsGuest = function () {
        game.joinGame();
        $location.path('/app');
      };

    if(window.user && !Storage.get('user')){
      Storage.set('user', window.user);
    }
    // Save Token if created
    if ($routeParams.token) {
      Storage.set('token', $routeParams.token);
      $location.path('/play-with');
    }

    $scope.playAsGuest = function() {
      game.joinGame();
      $location.path('/app');
    };

      $scope.showError = () => {
        if ($location.search().error) {
          return $location.search().error;
        }
        return false;
      };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });
    $scope.userName = Storage.get('user');
    }]);
