'use strict';
angular.module('pivocram.services', [])
    .service('Authentic', [function() {
        this.token = null;
        this.userId = null;
        this.update = function(token, userId) {
            if (token) {
                localStorage.setItem('XSRF-TOKEN', token);
            }
            if (userId) {
                localStorage.setItem('USER-ID', userId);
            }
            this.token = localStorage.getItem('XSRF-TOKEN');
            this.userId = localStorage.getItem('USER-ID');
        };
        this.isLogged = function() {
            return this.token != 'undefined' && this.token != null;
        };
        this.clean = function() {
            localStorage.removeItem('XSRF-TOKEN');
            localStorage.removeItem('USER-ID');
            this.update();
        };
    }])
    .factory('Story', ['$resource', function($resource) {
        return $resource(
            '{0}/api/project/:projectId/stories/:storyId'.format([urlBackEnd]),
             null,
            {'update': {method: 'PUT'}}
        );
    }])
    .factory('StoryTask', ['$resource', function($resource) {
        return $resource(
            '{0}/api/project/:projectId/stories/:storyId/tasks/:taskId'.format([urlBackEnd]),
             null,
            {'update': {method: 'PUT'}} 
        );
    }]);