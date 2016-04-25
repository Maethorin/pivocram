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
    .controller("BoardController", ['$rootScope', '$scope', '$routeParams', '$q', 'Story', 'StoryTask', function($rootScope, $scope, $routeParams, $q, Story, StoryTask) {
        $scope.columns = [
            {name: 'planned', label: 'Planned'},
            {name: 'started', label: 'Started'},
            {name: 'finished', label: 'Finished'},
            {name: 'delivered', label: 'Delivered'},
            {name: 'accepted', label: 'Accepted'}
        ];
        $scope.stories = Story.currents({projectId: $routeParams.projectId}, function() {
            angular.forEach($scope.stories, function(colunm) {
                angular.forEach(colunm, function(story) {
                    story.taskLoading = true;
                    story.tasks = [];
                    story.hasTasks = (story.current_state == 'planned' || story.current_state == 'started');
                    story.getTasks = function() {
                        var tasks = StoryTask.query({projectId: $routeParams.projectId, storyId: story.id}, function() {
                            story.taskLoading = false;
                            story.tasks = tasks;
                        });
                    };
                });
            })
        });
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
            var currentState = $(event.target).data('column');
            $scope.storyDragged.hasTasks = (currentState == 'planned' || currentState == 'started');
            return Story.update(
                {projectId: $routeParams.projectId, storyId: $scope.storyDragged.id},
                {"current_state": currentState}
            ).$promise;
        };
        $scope.completeTask = function(task, storyId) {
            StoryTask.update({projectId: $routeParams.projectId, storyId: storyId, taskId: task.id}, {complete: true}, function() {
                task.complete = true;
            });
        }
    }]);