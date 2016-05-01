'use strict';

angular.module('pivocram.user', [])
    .config(['$routeProvider', function($routeProvider) {
        var templatesFolder = '/templates';
        $routeProvider
            .when('/user/show', {
              templateUrl: '{0}/user/show.html'.format([templatesFolder]),
              controller: 'ShowUserController'
            })
            .when('/user/create', {
              templateUrl: '{0}/user/create.html'.format([templatesFolder]),
              controller: 'CreateUserController'
            });
    }])
    .controller("ShowUserController", ['$scope', 'User', function($scope, User) {
        $scope.user = User.get();
        $scope.updateUser = function() {

        };
    }]);