describe('Board module', function() {
    var $route, appConfig, $controller, $rootScope, Project, Story;
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$route_, _appConfig_, _$controller_, _$rootScope_, _Project_, _Story_) {
        $route = _$route_;
        appConfig = _appConfig_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
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
            expect($route.routes['/boards'].templateUrl).toBe('{0}/templates/boards.html'.format([appConfig.backendURL]));
        });
        it('should have configuration for board route', function() {
            expect($route.routes['/boards/:projectId'].controller).toBe('BoardController');
            expect($route.routes['/boards/:projectId'].templateUrl).toBe('{0}/templates/board.html'.format([appConfig.backendURL]));
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
            spyService = spyOn(Story, 'query');
            spyService.and.returnValue([1, 2, 3]);
            var $routeParams = {projectId: 123};
            $controller('BoardController', {$scope: $scope, $routeParams: $routeParams})
        });
        it('should have a project list', function() {
            expect($scope.stories).toEqual([1, 2, 3]);
            expect(spyService).toHaveBeenCalledWith({projectId: 123});
        });
        it('should point to the story html tempalte using backendURL', function() {
            expect($scope.storyTemplate).toEqual('{0}/templates/include/story.html'.format([appConfig.backendURL]));
        });
    })
});