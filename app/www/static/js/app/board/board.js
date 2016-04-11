'use strict';

angular.module('pivocram.board', [])
    .controller("BoardsController", ['$scope', 'Project', function($scope, Project) {
        $scope.projects = Project.query();
    }])
    .controller("BoardController", ['$rootScope', '$scope', '$routeParams', 'Story', function($rootScope, $scope, $routeParams, Story) {
        $scope.stories = Story.query({projectId: $routeParams.projectId});
    }]);