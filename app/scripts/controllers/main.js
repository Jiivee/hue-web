'use strict';

angular.module('hueWebApp')
  .controller('MainCtrl', function ($scope, $http, $timeout) {
    var ipAddress = 'http://192.168.1.6:3003/';
    var timeoutPromise;
    var delayInMs = 500;
    $scope.lights = [];
    $scope.lightTime = 10;
    $scope.hue = 0;
    $scope.saturation = 0;
    $scope.brightness = 0;

    var lights = [
      {id:1, name:1, selected: false},
      {id:2, name:2, selected: false},
      {id:3, name:3, selected: false},
      {id:4, name:4, selected: false},
      {id:5, name:5, selected: false},
      {id:6, name:6, selected: false}
    ];

    //get current
    $http.get(ipAddress + 'motion/motiontype').success(function(data) {
      if (data.type === 'timer') {
        $scope.motionType = true;
      }
      else {
        $scope.motionType = false;
      }
    });

    //Get lights that user has selected to modify
    $scope.getSelectedLights = function() {
      var selected = [];
      angular.forEach($scope.lights, function(light){
        if (light.selected) {
          selected.push(light.name);
        }
      });
      return selected;
    };

    //Get lights that are reacheable
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
        $scope.lights.push(lights[lampNumber-1]);
      });
    });

    //Send time that light will stay on after last movement to server
    $scope.setLightTime = function() {
      var data = {
        lighttime: $scope.lightTime
      };
      console.log(data);
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

    //get current values for selected lights
    $scope.$watch('lights', function() {
      var lightN = $scope.getSelectedLights()[0];
      if (lightN !== undefined) {
        $http.get(ipAddress + 'lights/' + lightN).success(function(data) {
          $scope.hue = data.state.hue;
          $scope.saturation = data.state.sat;
          $scope.brightness = data.state.bri;
          $scope.lightOn = data.state.on;
        });
        $http.get(ipAddress + 'motion/motionStatus/' + lightN).success(function(data) {
          $scope.motionStatus = data.status;
        });
      }
    }, true);

    //Order server to switch light on or off
    $scope.$watch('lightOn', function() {
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

    //if motion detection was turned on or off send that data to server
    $scope.$watch('motionStatus', function() {
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

    //if motion type was changed send new type to server
    $scope.$watch('motionType', function() {
      var motionType;
      if ($scope.motionType) {
        motionType = 'timer';
      }
      else {
        motionType = 'switch';
      }
      var data = {
        motionType: motionType
      };
      var request = $http({
        method: 'post',
        url: ipAddress + 'motion/motionType',
        data: data
      });
      request.success(
        function(response) {
          console.log(response);
        }
      );
    }, true);

    //Check if hue, brightness or saturation was changed and send new data to server
    $scope.$watch('[saturation, hue, brightness]', function() {
      var data = {
        hue: $scope.hue,
        brightness: $scope.brightness,
        saturation: $scope.saturation,
        lights: $scope.getSelectedLights()
      };

      $timeout.cancel(timeoutPromise);
      timeoutPromise = $timeout(function(){
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
