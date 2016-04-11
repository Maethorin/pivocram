'use strict';

angular.module('pivocram.board', [])
    .controller("BoardsController", ['$rootScope', '$routeParams', 'Project', function($rootScope, $routeParams, Project) {
    }])
    .controller("BoardController", ['$rootScope', '$scope', '$routeParams', 'Story', function($rootScope, $scope, $routeParams, Story) {
        $scope.stories = Story.query({projectId: $routeParams.projectId});
    }]);