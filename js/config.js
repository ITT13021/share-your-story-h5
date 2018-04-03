var shareStoryApp = angular.module("shareStoryApp", ['ngRoute', 'ngResource']);

shareStoryApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/login', {
        templateUrl: '../templates/login.html',
        controller: 'LoginCtrl'
    }).when('/register', {
        templateUrl: '../templates/register.html',
        controller: 'RegisterCtrl'
    }).otherwise({
        redirectTo: '/login'
    });
}])