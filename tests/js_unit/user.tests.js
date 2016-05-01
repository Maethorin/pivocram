describe('User module', function() {
    var $route, appConfig, $controller, $rootScope, $httpBackend, $location, AuthService, User;
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$route_, _appConfig_, _$controller_, _$rootScope_, _$httpBackend_, _$location_, _AuthService_, _User_) {
        $route = _$route_;
        appConfig = _appConfig_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        AuthService = _AuthService_;
        User = _User_;
    }));
    describe('Routes', function() {
        it('should have route to user profile', function() {
            expect($route.routes['/user/show']).toBeDefined();
        });
        it('should have route to create user', function() {
            expect($route.routes['/user/create']).toBeDefined();
        });
        it('should have configuration for show user route', function() {
            expect($route.routes['/user/show'].controller).toBe('ShowUserController');
            expect($route.routes['/user/show'].templateUrl).toBe('/templates/user/show.html');
        });
        it('should have configuration for create user route', function() {
            expect($route.routes['/user/create'].controller).toBe('CreateUserController');
            expect($route.routes['/user/create'].templateUrl).toBe('/templates/user/create.html');
        });
    });
    describe('Initializing Show User', function() {
        var $scope, user;
        beforeEach(function() {
            $scope = $rootScope.$new();
            user = {
                email: 'user@test.com',
                name: 'User Test',
                pivotalToken: 'PIVOTAL-TOKEN'
            };
            $httpBackend.expect('GET', '{0}/api/me'.format([appConfig.backendURL])).respond(200, user);
            $controller('ShowUserController', {$scope: $scope});
            $httpBackend.flush();
        });
        it('should call resource to get user', function() {
            expect($scope.user.email).toBe(user.email);
            expect($scope.user.name).toBe(user.name);
            expect($scope.user.pivotalToken).toBe(user.pivotalToken);
        });
        it('should have function to update user', function() {
            expect($scope.updateUser).toBeDefined();
        });
    });
});