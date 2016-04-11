describe('Board module', function() {
    var $route, appConfig;
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$route_, _appConfig_) {
        $route = _$route_;
        appConfig = _appConfig_;
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
});