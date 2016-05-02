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
    var ipAddress = 'http://192.168.1.4:3003/';
    var timeoutPromise;
    var delayInMs = 500;

    $scope.disabled = true;

    $scope.lights = [
      {id:1, name:1, selected: false, disabled: true},
      {id:2, name:2, selected: false, disabled: true},
      {id:3, name:3, selected: false, disabled: true},
      {id:4, name:4, selected: false, disabled: true},
      {id:5, name:5, selected: false, disabled: true},
      {id:6, name:6, selected: false, disabled: true}
    ];

    $scope.getSelectedLights = function() {
      var selected = [];
      angular.forEach($scope.lights, function(light){
        if (light.selected) {
          selected.push(light.name);
        }
      });
      return selected;
    };
    /*
    $http.get(ipAddress + 'lights').success(function(data) {
      console.log(data.state);
      $scope.hue = data.state.hue;
      $scope.saturation = data.state.sat;
      $scope.brightness = data.state.bri;

    });
  */
    $http.get(ipAddress + 'lights/status/all').success(function(data) {
      var lamps = data;
      $scope.activeLamps = [];
      for (var lamp in lamps) {
        if (lamps[lamp].state.reachable === true) {
          $scope.activeLamps.push(lamps[lamp]);
        }
      }
      angular.forEach($scope.activeLamps, function(lamp) {
        var lampNumber = lamp.name.split(' ')[2];
        $scope.lights[lampNumber-1].disabled = false;
      });
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
        saturation: $scope.saturation,
        lights: $scope.getSelectedLights()
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

    $scope.$watch('lights', function() {
      var lightN = $scope.getSelectedLights()[0];
      if (lightN !== undefined) {
        $http.get(ipAddress + 'lights/' + lightN).success(function(data) {
          console.log('data: ' + data);
          $scope.hue = data.state.hue;
          $scope.saturation = data.state.sat;
          $scope.brightness = data.state.bri;
          $scope.lightOn = data.state.on;
        });
      }
    }, true);

    $scope.$watch('lightOn', function() {
      console.log($scope.lightOn);
      var data = {
        on: $scope.lightOn,
        lights: $scope.getSelectedLights()
      };
      var request = $http({
        method: 'post',
        url: ipAddress + 'lights/status',
        data: data
      });
      request.success(
        function(data) {
          console.log(data);
        }
      );
    }, true);

    $scope.$watch('motionStatus', function() {
      console.log($scope.motionStatus);
      var data = {
        motionStatus: $scope.motionStatus,
        lights: $scope.getSelectedLights()
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

    $scope.$watch('[saturation, hue, brightness]', function() {
      var data = {
        hue: $scope.hue,
        brightness: $scope.brightness,
        saturation: $scope.saturation,
        lights: $scope.getSelectedLights()
      };

      $timeout.cancel(timeoutPromise);  //does nothing, if timeout alrdy done
      timeoutPromise = $timeout(function(){   //Set timeout
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

        request.error(
          function(response) {
            console.log(response);
          });
      },delayInMs);
    }, true);

  });
