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

angular.module(
    'pivocram',
    [
        'ngRoute',
        'ngResource',
        'ngDragDrop',
        'pivocram.services',
        'pivocram.board'
    ])
    .constant('appConfig', {
        'backendURL': setBackendURL(window.location)
    })
    .factory('updateToken', ['AuthService', '$location', '$q', function(AuthService, $location, $q) {
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
    .config(['$sceDelegateProvider', '$routeProvider', 'appConfig', function($sceDelegateProvider, $routeProvider, appConfig) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            '{0}/**'.format([appConfig.backendURL])
        ]);
    }])
    .run(['$rootScope', function($rootScope) {
        $rootScope.$on('$locationChangeSuccess', function(evt, absNewUrl, absOldUrl) {
            $rootScope.referrer = absOldUrl;
        });
    }]);

$(function() {
    $(".story .panel-heading").tooltip();
});