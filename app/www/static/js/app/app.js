'use strict';

var format = function(str, data) {
    return str.replace(/{([^{}]+)}/g, function(match, val) {
        var prop = data;
        val.split('.').forEach(function(key) {
            prop = prop[key];
        });

        return prop;
    });
};

String.prototype.format = function(data) {
    return format(this, data);
};

Number.prototype.paddingLeft = function(size, char) {
    if (!char) {
        char = '0'
    }
    var length = this.toString().length;
    if (length >= size) {
        return this.toString();
    }
    var result = [];
    for (var i = length; i < size; i++) {
        result.push(char);
    }
    return result.join('') + this.toString();
};

function setBackendURL(location) {
    var backendURL = 'https://pivocram.herokuapp.com';
    if (location.hostname == 'localhost' && location.port == '5000') {
        backendURL = 'http://localhost:5000';
    }
    if (location.hostname == '127.0.0.1') {
        backendURL = 'http://localhost:5000';
    }
    return backendURL;
}

function configApp($sceDelegateProvider, $httpProvider, appConfig) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        '{0}/**'.format([appConfig.backendURL])
    ]);
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('updateToken');
}

function runApp($rootScope, appConfig, AuthService) {
    AuthService.update();
    $rootScope.referrer = null;
    $rootScope.$on('$locationChangeSuccess', function(evt, absNewUrl, absOldUrl) {
        if (absOldUrl && absOldUrl.indexOf('login') == -1) {
            var completeURL = '{0}/#'.format([appConfig.backendURL]);
            $rootScope.referrer = absOldUrl.replace(completeURL, '');
        }
    });
}

angular.module(
    'pivocram',
    [
        'ngRoute',
        'ngResource',
        'ngDragDrop',
        'pivocram.services',
        'pivocram.login',
        'pivocram.user',
        'pivocram.board'
    ])
    .constant('appConfig', {
        'backendURL': setBackendURL(window.location)
    })
    .factory('updateToken', ['AuthService', '$rootScope', '$location', '$q', function(AuthService, $rootScope, $location, $q) {
        return {
            response: function(response) {
                var headers = response.headers();
                if (headers['XSRF-TOKEN']) {
                    AuthService.update(headers['XSRF-TOKEN'], headers['USER-NAME'])
                }
                return response;
            },
            responseError: function(response) {
                if (response.status == 401) {
                    AuthService.clear();
                    if ($location.path().indexOf('/login') == -1) {
                        $location.path("/login");
                    }
                }
                return $q.reject(response);
            },
            request: function(config) {
                config.headers['XSRF-TOKEN'] = AuthService.token;
                return config;
            }
        };
    }])
    .config(['$sceDelegateProvider', '$httpProvider', 'appConfig', function($sceDelegateProvider, $httpProvider, appConfig) {
        configApp($sceDelegateProvider, $httpProvider, appConfig);
    }])
    .run(['$rootScope', 'appConfig', 'AuthService', function($rootScope, appConfig, AuthService) {
        runApp($rootScope, appConfig, AuthService);
    }]);
