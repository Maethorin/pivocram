'use strict';

angular.module('pivocram.login', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: '/templates/login.html',
                controller: 'LoginController'
            });
    }])
    .controller("LoginController", ['$rootScope', '$scope', '$location', 'Login', 'AuthService', function($rootScope, $scope, $location, Login, AuthService) {
        $scope.login = new Login({
            email: null,
            password: null
        });
        
        $scope.loginFail = false;
        $scope.logingIn = function() {
            if ($scope.formLogin.$invalid) {
                $scope.loginFail = true;
                return false;
            }
            $scope.login.$save().then(
                function(resp) {
                    AuthService.update(resp.token, resp.userName);
                    if (!$rootScope.referrer) {
                        $rootScope.referrer = '/'
                    }
                    $location.path($rootScope.referrer);
                },
                function() {
                    $scope.loginFail = true;
                }
            );
        };
    }]);
