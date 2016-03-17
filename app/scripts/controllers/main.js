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

    $http.get('http://localhost:3003/users').success(function(data) {
      console.log(data.state);
      $scope.hue = data.state.hue;
      $scope.saturation = data.state.sat;
      $scope.brightness = data.state.bri;

    });

    $scope.hue = 0;
    $scope.saturation = 0;
    $scope.brightness = 0;

    $scope.setColor = function() {
      console.log('setColor');
      var data = {
        hue: $scope.hue,
        brightness: $scope.brightness,
        saturation: $scope.saturation
      };
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
