var shareStoryApp = angular.module("shareStoryApp", ['ngRoute', 'ngResource', 'ui.router']);

shareStoryApp.config(['$routeProvider','$stateProvider', '$urlRouterProvider' ,function($routeProvider, $stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/otherwise');
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
    .state('otherwise', {
        url: '/otherwise',
        templateUrl: '../templates/login.html',
        controller: 'LoginCtrl'
    })
}]);