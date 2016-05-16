'use strict';

/**
 * @ngdoc overview
 * @name hueWebApp
 * @description
 * # hueWebApp
 *
 * Main module of the application.
 */
angular
  .module('hueWebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
