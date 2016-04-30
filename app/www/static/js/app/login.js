// 'use strict';
//
// angular.module('pivocram.login', ['ngRoute'])
//     .config(['$routeProvider', function($routeProvider) {
//         $routeProvider
//             .when('/login', {
//                 templateUrl: '/templates/login.html',
//                 controller: 'LoginController'
//             });
//     }])
//     .controller("LoginController", ['$rootScope', '$scope', '$window', 'Login', 'AuthService', function($rootScope, $scope, $window, Login, AuthService) {
//         $rootScope.pagina = "atleta";
//         $rootScope.titulo = "Atleta";
//         $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
//         $scope.login = new Login({
//             'email': null,
//             'senha': null
//         });
//         $scope.campoValido = function(campo) {
//             if (campo) {
//                 return campo.$touched && campo.$valid
//             }
//             return true;
//         };
//         $scope.campoInvalido = function(campo) {
//             if (campo) {
//                 return campo.$touched && campo.$invalid
//             }
//             return false;
//         };
//         $scope.loginFalhou = false;
//         $scope.enviandoLogin = function() {
//             if ($scope.formLogin.$valid) {
//                 $scope.login.$save().then(
//                     function(resp) {
//                         Autentic.atualizaValores(resp.token, resp.userId);
//                         $rootScope.atletaLogado = Autentic.estaLogado();
//                         if ($rootScope.referrer) {
//                             $window.location = $rootScope.referrer;
//                         }
//                     },
//                     function() {
//                         $scope.loginFalhou = true;
//                     }
//                 );
//             }
//         };
//     }]);
