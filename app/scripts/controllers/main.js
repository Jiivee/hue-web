'use strict';

/**
 * @ngdoc function
 * @name hueWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hueWebApp
 */
angular.module('hueWebApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.test = 'aaaaaa';
    /*
    $http.get('http://localhost:3003/users').success(function(data) {
      console.log(data);
    });
    */
    $scope.hue = 0;

    $scope.setColor = function() {
      console.log('setColor');
      var data = {hue: $scope.hue};
      console.log(data);
      var request = $http({
        method: 'post',
        url: 'http://localhost:3003/users',
        data: data
      });

      request.success(
        function(response) {
          console.log(response);
        }
      );
    };

  });
