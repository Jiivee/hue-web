'use strict';

/**
 * @ngdoc function
 * @name hueWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hueWebApp
 */
angular.module('hueWebApp')
  .controller('MainCtrl', function ($scope, $http, $timeout) {
    $scope.test = 'aaaaaa';
    var ipAddress = 'http://192.168.1.5:3003/';
    var timeoutPromise;
    var delayInMs = 500;

    $http.get(ipAddress + 'lights').success(function(data) {
      console.log(data.state);
      $scope.hue = data.state.hue;
      $scope.saturation = data.state.sat;
      $scope.brightness = data.state.bri;

    });
    $scope.test = 90;

    $http.get(ipAddress + 'lights/status/all').success(function(data) {
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
    $scope.lightTime = 10;
    $scope.motionStatus = true;

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
        url: ipAddress + 'lights',
        data: data
      });

      request.success(
        function(response) {
          console.log(response);
        }
      );
    };

    $scope.setLightTime = function() {
      var data = {
        lighttime: $scope.lightTime
      };
      var request = $http({
        method: 'post',
        url: ipAddress + 'motion/lighttime',
        data: data
      });
      request.success(
        function(response) {
          console.log(response);
        }
      );
    };

    $scope.$watch('motionStatus', function() {
      console.log($scope.motionStatus);
      var data = {
        motionStatus: $scope.motionStatus
      };
      var request = $http({
        method: 'post',
        url: ipAddress + 'motion/status',
        data: data
      });
      request.success(
        function(response) {
          console.log(response);
        }
      );
    }, true);

    $scope.$watch('[hue, brightness]', function() {
      var data = {
        hue: $scope.hue,
        brightness: $scope.brightness,
        saturation: $scope.saturation
      };

      $timeout.cancel(timeoutPromise);  //does nothing, if timeout alrdy done
      timeoutPromise = $timeout(function(){   //Set timeout
        var request = $http({
          method: 'post',
          url: ipAddress + 'lights',
          data: data
        });

        request.success(
          function(response) {
            console.log(response);
          }
        );
      },delayInMs);
    }, true);

  });
