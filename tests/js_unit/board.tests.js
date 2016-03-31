describe('Board module', function() {
    var $route, appConfig;
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$route_, _appConfig_) {
        $route = _$route_;
        appConfig = _appConfig_;
    }));
    describe('Routes', function() {
        it('should have route to get the boards', function() {
            expect($route.routes['/boards']).toBeDefined();
        });
        it('should have configuration for boards route', function() {
            expect($route.routes['/boards'].controller).toBe('BoardsController');
            expect($route.routes['/boards'].templateUrl).toBe('{0}/templates/boards.html'.format([appConfig.backendURL]));
        });
    });
});