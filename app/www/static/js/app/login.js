'use strict';

angular.module('pivocram.login', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: '/templates/login.html',
                controller: 'LoginController'
            })
            .when('/logout', {
                templateUrl: '/templates/login.html',
                controller: 'LogoutController'
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
                    if (!$rootScope.referrer
                        || $rootScope.referrer.indexOf('login') > -1
                        || $rootScope.referrer.indexOf('logout') > -1) {
                        $rootScope.referrer = '/'
                    }
                    $location.path($rootScope.referrer);
                },
                function() {
                    $scope.loginFail = true;
                }
            );
        };
    }])
    .controller("LogoutController", ['AuthService', '$location', function(AuthService, $location) {
        AuthService.clear();
        $location.path('/login');
    }]);
