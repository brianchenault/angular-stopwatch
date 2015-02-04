'use strict';
require('angular');
var stopwatchApp = angular.module("stopwatchApp", []);

stopwatchApp.controller('stopwatchCtrl', function($scope) {
    $scope.init = function() {
        $scope.isRunning = false;
        $scope.isPaused = false;
        $scope.timerInterval = null;
        $scope.startTime = null;
        $scope.pauseTime = null;
        $scope.lapList = [];
        $scope.timer = {
            hours: '00',
            minutes: '00',
            seconds: '00',
            ms: '000'
        };
    };

    $scope.onLapClick = function() {
        if ($scope.isRunning) {
            var newLap = {
                position: $scope.lapList.length + 1,
                time: $scope.ensureLeadingZeros($scope.timer.hours, 2) + ':' +
                        $scope.ensureLeadingZeros($scope.timer.minutes, 2) + ':' +
                        $scope.ensureLeadingZeros($scope.timer.seconds, 2) + ':' +
                        $scope.ensureLeadingZeros($scope.timer.ms, 3)
            };

            $scope.lapList.unshift(newLap);
        }
    };
    $scope.interval = function() {
        var elapsedTime = Date.now() - $scope.startTime;
        $scope.timer.ms = $scope.ensureLeadingZeros(parseInt(elapsedTime % 1000), 3);
        $scope.timer.seconds = $scope.ensureLeadingZeros(parseInt(elapsedTime / 1000) % 60, 2);
        $scope.timer.minutes = $scope.ensureLeadingZeros(parseInt(elapsedTime / (1000 * 60)) % 60, 2);
        $scope.timer.hours = $scope.ensureLeadingZeros(parseInt(elapsedTime / (1000 * 60 * 60)) % 24, 2);
        $scope.$apply();
    };

    $scope.onStartClick = function() {
        // if no interval loop running
        if (!$scope.timerInterval) {
            $scope.isRunning = true;

            if (!$scope.isPaused) {
                $scope.startTime = Date.now();
            } else {
                // need to factor in the time that it was paused
                $scope.startTime = Date.now() - $scope.pauseTime;
                $scope.isPaused = false;
            }

            $scope.timerInterval = setInterval($scope.interval.bind($scope), 10);
        }
    };

    $scope.onResetClick = function() {
        clearInterval($scope.timerInterval);

        $scope.timerInterval = null;
        $scope.startTime = null;
        $scope.isRunning = false;
        $scope.lapCounter = 0;

        $scope.timer = {
            hours: '00',
            minutes: '00',
            seconds: '00',
            ms: '000'
        };
    };

    $scope.onStopClick = function() {
        // if already stopped, do nothing
        if ($scope.isRunning) {
            clearInterval($scope.timerInterval);

            $scope.timerInterval = null;
            $scope.isRunning = false;
            $scope.isPaused = true;
            $scope.pauseTime = Date.now() - $scope.startTime;
        }
    };

    $scope.ensureLeadingZeros = function(num, numSize) {
        num = num.toString();

        while (num.length < numSize) {
            num = '0' + num;
        }

        return num;
    };

    $scope.init();
});
