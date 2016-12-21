
angular.module('mean.system')
  .factory('Storage', ['localStorageService', function(localStorageService) {
    return {
      set: function(key, value) {
        return localStorageService.set(key, value);
      },

      get: function(key) {
        return localStorageService.get(key);
      },

      clear: function(key) {
        return localStorageService.remove(key);
      },
    };
}]);
