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
        $scope.estimates = {
            'planned': 0,
            'unstarted': 0,
            'started': 0,
            'finished': 0,
            'delivered': 0,
            'accepted': 0
        };
        $scope.updateStoryData = function() {
            angular.forEach($scope.stories, function(column) {
                angular.forEach(column, function(story) {
                    var estimateKey = story.current_state;
                    if (estimateKey == 'unstarted') {
                        estimateKey = 'planned'
                    }
                    $scope.estimates[estimateKey] += story.estimate;
                    story.taskLoading = true;
                    story.tasks = [];
                    story.hasTasks = ['planned', 'unstarted', 'started'].indexOf(story.current_state) > -1;
                    story.getTasks = function() {
                        var tasks = StoryTask.query({projectId: $routeParams.projectId, storyId: story.id}, function() {
                            story.taskLoading = false;
                            story.tasks = tasks;
                        });
                    };
                });
            });
        };
        $scope.stories = Story.currents({projectId: $routeParams.projectId}, $scope.updateStoryData);
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
        $scope.changeTaskStatus = function(task, storyId) {
            var state = task.complete ? 'false' : 'true';
            StoryTask.update({projectId: $routeParams.projectId, storyId: storyId, taskId: task.id}, {complete: state}, function() {
                task.complete = state == 'true';
            });
        }
    }]);