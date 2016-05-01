'use strict';

angular.module('pivocram.user', [])
    .directive('passwordMatch', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.passwordMatch = function(modelValue, viewValue) {
                    if (scope.password) {
                        return scope.password.new == (viewValue || ctrl.$viewValue);
                    }
                };
            }
        };
    })
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
        $scope.errorMessage = null;
        $scope.updateFail = false;
        $scope.updateComplete = false;
        $scope.changePasswordFail = false;
        $scope.changePasswordComplete = false;
        $scope.password = {new: null, confirm: null};
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
        $scope.changePassword = function() {
            $scope.changePasswordFail = false;
            $scope.errorMessage = null;
            $scope.changePasswordComplete = false;
            if ($scope.formPassword.$invalid) {
                $scope.changePasswordFail = true;
                $scope.errorMessage = 'invalid form data';
                $scope.password = {new: null, confirm: null};
                return false;
            }
            new User({password: $scope.password.new}).$update().then(
                function() {
                    $scope.changePasswordComplete = true;
                },
                function(resp) {
                    $scope.changePasswordFail = true;
                    $scope.errorMessage = resp.data.errorMessage;
                }
            );
            $scope.password = {new: null, confirm: null};
        };
    }]);