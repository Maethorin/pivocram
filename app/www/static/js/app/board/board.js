'use strict';

angular.module('pivocram.board', [])
    .controller("BoardsController", ['$scope', 'Project', function($scope, Project) {
        $scope.projects = Project.query();
    }])
    .controller("BoardController", ['$rootScope', '$scope', '$routeParams', 'Story', 'appConfig', function($rootScope, $scope, $routeParams, Story, appConfig) {
        $scope.stories = Story.query({projectId: $routeParams.projectId});
        $scope.storyTemplate = '{0}/templates/include/story.html'.format([appConfig.backendURL]);
    }]);