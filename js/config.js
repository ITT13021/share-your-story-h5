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
    .state('user', {
        url: '/user',
        templateUrl: '../templates/user.html',
        controller: 'UserCtrl'
    })
    .state('otherwise', {
        url: '/otherwise',
        templateUrl: '../templates/home.html',
        controller: 'HomeCtrl'
    });
    $httpProvider.interceptors.push(function ($cookies) {
        return {
            'request': function (config) {
                var user = $cookies.get('user') ? JSON.parse($cookies.get('user')) : null;
                if (user) {
                    config.headers['authorization'] = 'Token ' + user.token;
                }
                config.timeout = 60000;
                return config;
            }
        };
    });
}]);