describe('Login module', function() {
    var $route, appConfig, $controller, $rootScope, $httpBackend, $location, AuthService, Login;
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$route_, _appConfig_, _$controller_, _$rootScope_, _$httpBackend_, _$location_, _AuthService_, _Login_) {
        $route = _$route_;
        appConfig = _appConfig_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        AuthService = _AuthService_;
        Login = _Login_;
    }));
    describe('Routes', function() {
        it('should have route to login age', function() {
            expect($route.routes['/login']).toBeDefined();
        });
        it('should have configuration for boards route', function() {
            expect($route.routes['/login'].controller).toBe('LoginController');
            expect($route.routes['/login'].templateUrl).toBe('/templates/login.html');
        });
    });
    describe('Initializing Login', function() {
        var $scope;
        beforeEach(function() {
            $scope = $rootScope.$new();
            $controller('LoginController', {$scope: $scope})
        });
        it('should have a login model', function() {
            expect($scope.login.email).toBeNull();
            expect($scope.login.password).toBeNull();
        });
        it('should have flag to indicate login failed', function() {
            expect($scope.loginFail).toBeDefined();
            expect($scope.loginFail).toBeFalsy();
        });
        it('should have function to send login', function() {
            expect($scope.logingIn).toBeDefined();
        });
    });
    describe('Loging In', function() {
        var $scope, loginMock;
        var loginSuccess = true;
        beforeEach(function() {
            $scope = $rootScope.$new();
            $scope.formLogin = {
                $invalid: false
            };
            loginMock = {
                then: function(success, error) {
                    if (loginSuccess) {
                        success({token: 'TOOKEN', userName: 'User Name'});
                    }
                    else {
                        error();
                    }
                }
            };
            $controller('LoginController', {$scope: $scope})
        });
        it('should flag login fail if form is invalid', function() {
            $scope.formLogin.$invalid = true;
            $scope.logingIn();
            expect($scope.loginFail).toBeTruthy();
        });
        it('should call resource if data is ok', function() {
            var spyLogin = spyOn(Login, 'save').and.returnValue(loginMock);
            $scope.logingIn();
            expect(spyLogin).toHaveBeenCalled();
        });
        it('should use AuthService if response was success', function() {
            spyOn(Login, 'save').and.returnValue(loginMock);
            var spyAuth = spyOn(AuthService, 'update');
            $scope.logingIn();
            expect(spyAuth).toHaveBeenCalledWith('TOOKEN', 'User Name');
        });
        it('should redirect to home after success', function() {
            spyOn(Login, 'save').and.returnValue(loginMock);
            spyOn(AuthService, 'update');
            var spyLocation = spyOn($location, 'path');
            $scope.logingIn();
            expect(spyLocation).toHaveBeenCalledWith('/');
        });
        it('should redirect to referrer if exists after success', function() {
            spyOn(Login, 'save').and.returnValue(loginMock);
            spyOn(AuthService, 'update');
            var spyLocation = spyOn($location, 'path');
            $rootScope.referrer = 'another-url';
            $scope.logingIn();
            expect(spyLocation).toHaveBeenCalledWith('another-url');
        });
        it('should set flag login fail to true on error', function() {
            spyOn(Login, 'save').and.returnValue(loginMock);
            loginSuccess = false;
            $scope.logingIn();
            expect($scope.loginFail).toBeTruthy();
        });
    });
});