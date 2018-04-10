var shareStoryApp = angular.module("shareStoryApp", ['ngRoute', 'ngResource', 'ui.router', 'ngCookies']);

shareStoryApp.config(['$routeProvider','$stateProvider', '$urlRouterProvider', '$httpProvider', function($routeProvider, $stateProvider, $urlRouterProvider, $httpProvider){
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
    .state('home', {
        url: '/home',
        templateUrl: '../templates/home.html',
        controller: 'HomeCtrl'
    })
    .state('detail', {
        url: '/detail',
        templateUrl: '../templates/detail.html',
        controller: 'DetailCtrl'
    })
    .state('otherwise', {
        url: '/otherwise',
        templateUrl: '../templates/home.html',
        controller: 'HomeCtrl'
    });
    $httpProvider.interceptors.push(function ($cookies) {
        var user_token = $cookies.get("token");
        return {
            'request': function (config) {
                if (user_token) {
                    config.headers['authorization'] = 'Token ' + user_token;
                }
                config.timeout = 60000;
                return config;
            }
        };
    });
}]);