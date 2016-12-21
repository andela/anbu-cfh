angular.module('mean.system')
  .factory('AuthInterceptor', ['Storage', function(Storage) {
    var AuthInterceptor = {
    request: function(config) {
      console.log('AuthInterceptor Called');
      if (Storage.get('token')) {
        config.headers['x-access-token'] = Storage.get('token');
      }
      return config;
    }
  };
  return AuthInterceptor;
}]);
