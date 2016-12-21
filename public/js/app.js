angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.route', 'mean.system', 'mean.directives', 'LocalStorageModule'])
  .config(['$routeProvider',
      function($routeProvider) {
          $routeProvider.
          when('/', {
            templateUrl: 'views/index.html'
          }).
          when('/app', {
            templateUrl: '/views/app.html',
          }).
          when('/privacy', {
            templateUrl: '/views/privacy.html',
          }).
          when('/token/:token', {
            templateUrl: 'views/index.html'
          }).
          when('/remove-token', {
            templateUrl: 'views/token.html'
          }).
          when('/bottom', {
            templateUrl: '/views/bottom.html'
          }).
          when('/signin', {
            templateUrl: '/views/signin.html'
          }).
          when('/signup', {
            templateUrl: '/views/signup.html'
          }).
          when('/play-with', {
            templateUrl: '/views/play.html'
          }).
          when('/choose-avatar', {
            templateUrl: '/views/choose-avatar.html'
          }).
          when('/gametour', {
            templateUrl: '/views/gametour.html'
          }).
          otherwise({
            redirectTo: '/'
          });
      }
  ]).config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
  ]).run(['$rootScope', function($rootScope) {
  $rootScope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
            fn();
        }
    } else {
        this.$apply(fn);
      }
    };
  }]).run(['DonationService', function (DonationService) {
    window.userDonationCb = function (donationObject) {
      DonationService.userDonated(donationObject);
    };
  }]);

angular.module('mean.system', [])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }]);

angular.module('mean.directives', []);
