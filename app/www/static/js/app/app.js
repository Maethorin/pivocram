'use strict';

var format = function(str, data) {
    var re = /{([^{}]+)}/g;

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

var urlBackEnd = '//pivocram.herokuapp.com';
if (window.location.hostname == 'localhost' && window.location.port == '5000') {
    urlBackEnd = 'http://localhost:5000';
}
if (window.location.hostname == '127.0.0.1') {
    urlBackEnd = 'http://localhost:5000';
}

var configApp = function($sceDelegateProvider, $httpProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        '{0}/**'.format([urlBackEnd])
    ]);
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('updateToken');
};

var baseRun = function($rootScope, Authentic) {
    $rootScope.$on('$locationChangeSuccess', function(evt, absNewUrl, absOldUrl) {
        $rootScope.referrer = absOldUrl;
    });
    Authentic.update();
};

var updateTokenFactory = function(Authentic, $rootScope, $q, $window) {
    var tokenHeader = 'xsrf-token';
    var userHeader = 'user-id';
    var loggedProperty = 'userLogged';
    return {
        response: function(response) {
            var headers = response.headers();
            if (headers[tokenHeader]) {

                Authentic.update(headers[tokenHeader], headers[userHeader])
            }
            return response;
        },
        responseError: function(response) {
            if (response.status == 401) {
                Authentic.clean();
                $rootScope[loggedProperty] = Authentic.isLogged();
            }
            if (ehAdmin && $window.location.hash.indexOf('#/login') == -1) {
                $window.location = '{0}/#/login'.format([urlBackEnd]);
            }
            return $q.reject(response);
        },
        request: function(config) {
            config.headers[tokenHeader.toUpperCase()] = Authentic.token;
            return config;
        }
    };
};


angular.module(
    'pivocram',
    [
        'ngRoute',
        'ngResource',
        'pivocram.services'
    ])
    .factory('updateToken', ['Authentic', '$rootScope', '$q', function(Authentic, $rootScope, $q) {
        return updateTokenFactory(Authentic, $rootScope, $q);
    }])
    .config(['$sceDelegateProvider', '$httpProvider', function($sceDelegateProvider, $httpProvider) {
        configApp($sceDelegateProvider, $httpProvider);
    }])
    .run(['$rootScope', 'Authentic', function($rootScope, Authentic) {
        baseRun($rootScope, Authentic);
        $rootScope.userLogged = Authentic.isLogged();
    }]);