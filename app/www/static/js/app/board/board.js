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
        function parseDate(date) {
            date = date.split('').slice(0, 10).join('').split('-');
            return new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]));
        }
        function range(value) {
            var result = [];
            for (var i = 1;  i <= value; i++) {
                result.push(i);
            }
            return result;
        }
        $scope.today = new Date();
        $scope.updateStoryData = function() {
            if (!$scope.stories) {
                $scope.stories = $scope.iteration.stories;
            }
            $scope.estimates = {
                'planned': 0,
                'unstarted': 0,
                'started': 0,
                'finished': 0,
                'delivered': 0,
                'accepted': 0
            };
            var totalPoints = [];
            angular.forEach($scope.stories, function(column) {
                angular.forEach(column, function(story) {
                    var estimateKey = story.current_state;
                    if (estimateKey == 'unstarted') {
                        estimateKey = 'planned'
                    }
                    totalPoints.push(story.estimate);
                    $scope.estimates[estimateKey] += story.estimate;
                    story.hasTasks = ['planned', 'unstarted', 'started'].indexOf(story.current_state) > -1;
                    if (!story.tasks && story.hasTasks) {
                        story.taskLoading = true;
                        story.tasks = [];
                        story.getTasks = function() {
                            story.tasks = StoryTask.query({projectId: $routeParams.projectId, storyId: story.id}, function() {
                                story.taskLoading = false;
                            });
                        };
                    }
                });
            });
            $q.all(totalPoints).then(function () {
                var start = parseDate($scope.iteration.start);
                var finish = parseDate($scope.iteration.finish);
                var days = parseInt((finish - start) / (1000 * 60 * 60 * 24)) + start.getDate() - 2;
                $scope.devDays = [];
                for (var dayNumber = start.getDate(); dayNumber <= days; dayNumber++) {
                    start.setDate(start.getDate() + 1);
                    if (start.getDay() != 0 && start.getDay() != 6) {
                        var passed = $scope.today.getMonth() > start.getMonth() || ($scope.today.getDate() > start.getDate() && $scope.today.getMonth() == start.getMonth());
                        var isToday = $scope.today.getMonth() == start.getMonth() && $scope.today.getDate() == start.getDate();
                        $scope.devDays.push({id: dayNumber, day: start.getDate(), points: 0, passed: passed, isToday: isToday});
                    }
                }

                totalPoints = totalPoints.reduce(function(a, b) { return a + b; });
                for (var devdayIndex = 0; devdayIndex < $scope.devDays.length; devdayIndex++) {
                    $scope.devDays[devdayIndex].points = totalPoints / $scope.devDays.length;
                }

                $scope.pointsPerColumn = [];
                var accumlatedPoint = 1;
                function addPointsToColumn(columnName) {
                    angular.forEach(range($scope.estimates[columnName]), function() {
                        $scope.pointsPerColumn.push({column: columnName, point: accumlatedPoint});
                        accumlatedPoint += 1;
                    });
                }
                addPointsToColumn('accepted');
                addPointsToColumn('delivered');
                addPointsToColumn('finished');
                addPointsToColumn('started');
                addPointsToColumn('planned');
             });
        };
        $scope.iteration = Story.currents({projectId: $routeParams.projectId}, $scope.updateStoryData);
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
        $scope.dropStory = function() {
            $scope.updateStoryData();
            $scope.$apply();
        };
        $scope.saveCurrentState = function(event, ui) {
            var currentState = $(event.target).data('column');
            $scope.storyDragged.hasTasks = (currentState == 'planned' || currentState == 'started');
            $scope.storyDragged.current_state = currentState;
            return Story.update(
                {projectId: $routeParams.projectId, storyId: $scope.storyDragged.id},
                {"current_state": currentState}
            ).$promise;
        };
        $scope.changeTaskStatus = function(task, storyId) {
            if (task.changing) {
                return false;
            }
            task.changing = true;
            var state = task.complete ? 'false' : 'true';
            StoryTask.update({projectId: $routeParams.projectId, storyId: storyId, taskId: task.id}, {complete: state}, function() {
                task.complete = state == 'true';
                task.changing = false;
            });
        }
    }]);