'use strict';

angular.module('pivocram.board', [])
    .controller("BoardsController", ['$scope', 'Project', function($scope, Project) {
        $scope.projects = Project.query();
    }])
    .controller("BoardController", ['$rootScope', '$scope', '$routeParams', 'Story', 'appConfig', function($rootScope, $scope, $routeParams, Story, appConfig) {
        $scope.columns = [
            {name: 'planned', label: 'Planned'},
            {name: 'started', label: 'Started'},
            {name: 'finished', label: 'Finished'},
            {name: 'delivered', label: 'Delivered'}
        ];
        $scope.stories = Story.currents({projectId: $routeParams.projectId});
        $scope.columnTemplate = '{0}/templates/include/board-column.html'.format([appConfig.backendURL]);
        $scope.storyDragged = null;
        $scope.dragStory = function(event, ui, story) {
            $scope.storyDragged = story;
        };
        $scope.dropStory = function() {
        };
    }]);