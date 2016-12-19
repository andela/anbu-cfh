angular.module('mean.system')
  .factory('AuthInterceptor', ['Storage', function(Storage) {
    var AuthInterceptor = {
    request: function(config) {
      if (Storage.get('token')) {
        config.headers['x-access-token'] = Storage.get('token');
      }
      return config;
    }
  };
  return AuthInterceptor;
}]);
