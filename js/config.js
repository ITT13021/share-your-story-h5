var shareStoryApp = angular.module("shareStoryApp", ['ngRoute', 'ngResource', 'ui.router']);

shareStoryApp.config(['$routeProvider','$stateProvider', function($routeProvider, $stateProvider){
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '../templates/login.html',
        controller: 'LoginCtrl'
    })
    .state('register', {
        url: '/register',
        templateUrl: '../templates/register.html',
        controller: 'RegisterCtrl'
    })
}]);