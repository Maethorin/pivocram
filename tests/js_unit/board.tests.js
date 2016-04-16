describe('Board module', function() {
    var $route, appConfig, $controller, $rootScope, $httpBackend, Project, Story;
    var $routeParams = {
        projectId: 123
    };
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$route_, _appConfig_, _$controller_, _$rootScope_, _$httpBackend_, _Project_, _Story_) {
        $route = _$route_;
        appConfig = _appConfig_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        Project = _Project_;
        Story = _Story_;
    }));
    describe('Routes', function() {
        it('should have route to get boards', function() {
            expect($route.routes['/boards']).toBeDefined();
        });
        it('should have route to get the board', function() {
            expect($route.routes['/boards/:projectId']).toBeDefined();
        });
        it('should have configuration for boards route', function() {
            expect($route.routes['/boards'].controller).toBe('BoardsController');
            expect($route.routes['/boards'].templateUrl).toBe('/templates/boards.html');
        });
        it('should have configuration for board route', function() {
            expect($route.routes['/boards/:projectId'].controller).toBe('BoardController');
            expect($route.routes['/boards/:projectId'].templateUrl).toBe('/templates/board.html');
        });
    });
    describe('Initializing Boards', function() {
        var $scope, spyService;
        beforeEach(function() {
            $scope = $rootScope.$new();
            spyService = spyOn(Project, 'query');
            spyService.and.returnValue([1, 2, 3]);
            $controller('BoardsController', {$scope: $scope})
        });
        it('should have a project list', function() {
            expect($scope.projects).toEqual([1, 2, 3]);
            expect(spyService).toHaveBeenCalledWith();
        })
    });
    describe('Initializing Board', function() {
        var $scope, spyService;
        beforeEach(function() {
            $scope = $rootScope.$new();
            spyService = spyOn(Story, 'currents');
            spyService.and.returnValue([1, 2, 3]);
            var $routeParams = {projectId: 123};
            $controller('BoardController', {$scope: $scope, $routeParams: $routeParams})
        });
        it('should have a project list', function() {
            expect($scope.stories).toEqual([1, 2, 3]);
            expect(spyService).toHaveBeenCalledWith({projectId: 123});
        });
        it('should have column list', function() {
            expect($scope.columns).toEqual([
                {name: 'planned', label: 'Planned'},
                {name: 'started', label: 'Started'},
                {name: 'finished', label: 'Finished'},
                {name: 'delivered', label: 'Delivered'},
                {name: 'accepted', label: 'Accepted'}
            ]);
        });
        it('should set correct column size based on label', function() {
            expect($scope.addColumnSize('planned')).toBe('col-md-3');
            expect($scope.addColumnSize('started')).toBe('col-md-3');
            expect($scope.addColumnSize('finished')).toBe('col-md-2');
            expect($scope.addColumnSize('delivered')).toBe('col-md-2');
            expect($scope.addColumnSize('accepted')).toBe('col-md-2');
        });
        it('should point to the column html template using backendURL', function() {
            expect($scope.columnTemplate).toEqual('/templates/include/board-column.html');
        });
        it('should set story dragged on drag', function() {
            expect($scope.storyDragged).toBe(null);
            $scope.dragStory('', '', 'DRAGGED');
            expect($scope.storyDragged).toBe('DRAGGED');
        });
        it('should use resource to update story current state', function() {
            $scope.storyDragged = {id: 12344};
            $httpBackend.expect('PUT', '{0}/api/projects/123/stories/12344'.format([appConfig.backendURL]), {"current_state": "accepted"}).respond(200, {});
            var dataSpy = spyOn($.fn, 'data');
            dataSpy.and.returnValue('accepted');
            $scope.saveCurrentState({target: '<div></div>'});
            $httpBackend.flush();
            expect(dataSpy).toHaveBeenCalledWith('column');
        });
    })
});