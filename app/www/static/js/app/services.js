'use strict';
angular.module('pivocram.services', [])
    .factory('Project', ['$resource', 'appConfig', function($resource, appConfig) {
        return $resource('{0}/api/projects/:projectId'.format([appConfig.backendURL]));
    }])
    .factory('Story', ['$resource', 'appConfig', function($resource, appConfig) {
        return $resource(
            '{0}/api/projects/:projectId/stories/:storyId'.format([appConfig.backendURL]),
             null,
            {'update': {method: 'PUT'}}
        );
        
    }])
    .factory('StoryTask', ['$resource', 'appConfig', function($resource, appConfig) {
        return $resource(
            '{0}/api/projects/:projectId/stories/:storyId/tasks/:taskId'.format([appConfig.backendURL]),
             null,
            {'update': {method: 'PUT'}}
        );
    }]);