angular.module('mean.system')
  .factory('AuthInterceptor', ['LocalStorage', function(LocalStorage) {
    var AuthInterceptor = {
    request: function(config) {
      if (LocalStorage.getToken('token')) {
        config.headers['x-access-token'] = LocalStorage.getToken('token');
      }
      return config;
    }
  };
  return AuthInterceptor;
}]);
