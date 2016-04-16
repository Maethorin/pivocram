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
        $scope.columnTemplate = '/templates/include/board-column.html';
        $scope.storyDragged = null;
        $scope.dragStory = function(event, ui, story) {
            $scope.storyDragged = story;
        };
        $scope.dropStory = function(event, ui) {
            console.log(event);
        };
    }]);