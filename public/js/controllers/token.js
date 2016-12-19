angular.module('mean.system')
  .controller('TokenController', ['Storage', '$routeParams', '$location',
    function (Storage, $routeParams, $location) {
    // Delete token when user signs Out
    Storage.clear('token');
    Storage.set('user', null);
    $location.path('/');
}]);
