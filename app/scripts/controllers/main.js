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

    $http.get('http://localhost:3003/lights').success(function(data) {
      console.log(data.state);
      $scope.hue = data.state.hue;
      $scope.saturation = data.state.sat;
      $scope.brightness = data.state.bri;

    });
    $scope.test = 90;

    $http.get('http://localhost:3003/lights/status/all').success(function(data) {
      console.log(data[1]);
      var lamps = data;
      $scope.activeLamps = [];
      for (var lamp in lamps) {
        if (lamps[lamp].state.reachable === true) {
          $scope.activeLamps.push(lamps[lamp]);
        }
      }
      console.log($scope.activeLamps);

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
        url: 'http://localhost:3003/lights',
        data: data
      });

      request.success(
        function(response) {
          console.log(response);
        }
      );
    };

    $scope.$watch('hue', function() {
      var data = {
        hue: $scope.hue,
        brightness: $scope.brightness,
        saturation: $scope.saturation
      };
      console.log(data);
      var request = $http({
        method: 'post',
        url: 'http://localhost:3003/lights',
        data: data
      });

      request.success(
        function(response) {
          console.log(response);
        }
      );
    }, true);

  });
