'use strict';
angular.module('pivocram.services', [])
    .service('AuthService', [function() {
        this.token = null;
        this.userName = null;
        this.update = function(token, userName) {
            if (token) {
                localStorage.setItem('XSRF-TOKEN', token);
            }
            if (userName) {
                localStorage.setItem('USER-NAME', userName);
            }
            this.token = localStorage.getItem('XSRF-TOKEN');
            this.userName = localStorage.getItem('USER-NAME');
        };
        this.userIsLogged = function() {
            return localStorage.getItem('XSRF-TOKEN') != null;
        };
        this.clear = function() {
            localStorage.removeItem('XSRF-TOKEN');
            localStorage.removeItem('USER-NAME');
            this.update();
        };
    }])
    // .factory('Login', ['$resource', function($resource) {
    //     return $resource('{0}/api/login'.format([urlBackEnd]));
    // }])
    .factory('Project', ['$resource', 'appConfig', function($resource, appConfig) {
        return $resource('{0}/api/projects/:projectId'.format([appConfig.backendURL]));
    }])
    .factory('Story', ['$resource', 'appConfig', function($resource, appConfig) {
        return $resource(
            '{0}/api/projects/:projectId/stories/:storyId'.format([appConfig.backendURL]),
            null,
            {
                'update': {method: 'PUT'},
                'currents': {method: 'GET'}
            }
        );
    }])
    .factory('StoryTask', ['$resource', 'appConfig', function($resource, appConfig) {
        return $resource(
            '{0}/api/projects/:projectId/stories/:storyId/tasks/:taskId'.format([appConfig.backendURL]),
            null,
            {'update': {method: 'PUT'}}
        );
    }]);