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
        $scope.updateFail = false;
        $scope.errorMessage = null;
        $scope.updateComplete = false;
        $scope.updateUser = function() {
            $scope.updateFail = false;
            $scope.errorMessage = null;
            $scope.updateComplete = false;
            if ($scope.formUser.$invalid) {
                $scope.updateFail = true;
                $scope.errorMessage = 'one or more required field missing';
                return false;
            }
            $scope.user.$update().then(
                function() {
                    $scope.updateComplete = true;
                },
                function(resp) {
                    $scope.updateFail = true;
                    $scope.errorMessage = resp.data.errorMessage;
                }
            );
        };
    }]);