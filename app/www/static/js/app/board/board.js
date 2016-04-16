'use strict';

angular.module('pivocram.board', [])
    .controller("BoardsController", ['$scope', 'Project', function($scope, Project) {
        $scope.projects = Project.query();
    }])
    .config(['$routeProvider', function($routeProvider) {
        var templatesFolder = '/templates';
        $routeProvider
            .when('/boards', {
              templateUrl: '{0}/boards.html'.format([templatesFolder]),
              controller: 'BoardsController'
            })
            .when('/boards/:projectId', {
              templateUrl: '{0}/board.html'.format([templatesFolder]),
              controller: 'BoardController'
            });
    }])
    .controller("BoardController", ['$rootScope', '$scope', '$routeParams', '$q', 'Story', function($rootScope, $scope, $routeParams, $q, Story) {
        $scope.columns = [
            {name: 'planned', label: 'Planned'},
            {name: 'started', label: 'Started'},
            {name: 'finished', label: 'Finished'},
            {name: 'delivered', label: 'Delivered'},
            {name: 'accepted', label: 'Accepted'}
        ];
        $scope.stories = Story.currents({projectId: $routeParams.projectId});
        $scope.columnTemplate = '/templates/include/board-column.html';
        $scope.addColumnSize = function(columnName) {
            if (columnName == 'planned' || columnName == 'started') {
                return 'col-md-3';
            }
            return 'col-md-2';
        };
        $scope.storyDragged = null;
        $scope.dragStory = function(event, ui, story) {
            $scope.storyDragged = story;
        };
        $scope.saveCurrentState = function(event, ui) {
            return Story.update(
                {projectId: $routeParams.projectId, storyId: $scope.storyDragged.id},
                {"current_state": $(event.target).data('column')}
            ).$promise;
        };
    }]);