
angular.module('mean.system')
  .factory('LocalStorage', ['localStorageService', function(localStorageService) {
    return {
      storeToken: function(key, value) {
        return localStorageService.set(key, value);
      },

      getToken: function(key) {
        return localStorageService.get(key);
      },

      clearToken: function(key) {
        return localStorageService.remove(key);
      },
    };
}]);
