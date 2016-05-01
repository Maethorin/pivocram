describe('User module', function() {
    var $route, appConfig, $controller, $rootScope, $httpBackend, $location, $compile, AuthService, User;
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$route_, _appConfig_, _$controller_, _$rootScope_, _$httpBackend_, _$location_, _$compile_, _AuthService_, _User_) {
        $route = _$route_;
        appConfig = _appConfig_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        $compile = _$compile_;
        AuthService = _AuthService_;
        User = _User_;
    }));
    describe('password-match', function() {
        var $scope;
        beforeEach(function() {
            $scope = $rootScope.$new();
            $scope.password = {new: '1234', confirm: null};
            var html = [
                '<form name="form" novalidate>',
                '<input type="password" ng-model="confirmPassword" name="confirmPassword" password-match />',
                '</form>'
            ].join('');
            $compile(html)($scope);
        });
        it('should have for password confirmation', function() {
            expect($scope.form.confirmPassword.$validators.passwordMatch).toBeDefined();
        });
        it('should set invalid if passwords does not match', function() {
            $scope.form.confirmPassword.$setViewValue('1222');
            expect($scope.form.confirmPassword.$validators.passwordMatch()).toBeFalsy();
        });
        it('should set invalid if passwords does not match passing to function', function() {
            expect($scope.form.confirmPassword.$validators.passwordMatch(null, '1222')).toBeFalsy();
        });
        it('should set valid if passwords match', function() {
            $scope.form.confirmPassword.$setViewValue('1234');
            expect($scope.form.confirmPassword.$validators.passwordMatch()).toBeTruthy();
        });
        it('should set valid if passwords match passing to function', function() {
            expect($scope.form.confirmPassword.$validators.passwordMatch(null, '1234')).toBeTruthy();
        });
    });
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
        it('should have flag to indicate update failed', function() {
            expect($scope.updateFail).toBeDefined();
            expect($scope.updateFail).toBeFalsy();
        });
        it('should have flag to indicate password change failed', function() {
            expect($scope.changePasswordFail).toBeDefined();
            expect($scope.changePasswordFail).toBeFalsy();
        });
        it('should have errorMessage', function() {
            expect($scope.errorMessage).toBeDefined();
        });
        it('should have flag to indicate update complete', function() {
            expect($scope.updateComplete).toBeDefined();
            expect($scope.updateComplete).toBeFalsy();
        });
        it('should have flag to indicate password change complete', function() {
            expect($scope.changePasswordComplete).toBeDefined();
            expect($scope.changePasswordComplete).toBeFalsy();
        });
        it('should have function to update user', function() {
            expect($scope.updateUser).toBeDefined();
        });
        it('should have newPassword', function() {
            expect($scope.password).toEqual({new: null, confirm: null});
        });
        it('should have function to password change', function() {
            expect($scope.changePassword).toBeDefined();
        });
    });
    describe('Updating user name and pivotal token', function() {
        var $scope, user;
        beforeEach(function() {
            $scope = $rootScope.$new();
            $scope.formUser = {
                $invalid: false
            };
            user = {name: 'User Name', pivotalToken: 'PIVOTAL-TOKEN', email: 'user@test.com'};
            $httpBackend.expect('GET', '{0}/api/me'.format([appConfig.backendURL])).respond(200, user);
            $controller('ShowUserController', {$scope: $scope})
        });
        it('should flag update fail if form is invalid', function() {
            $scope.formUser.$invalid = true;
            $scope.updateUser();
            expect($scope.updateFail).toBeTruthy();
            expect($scope.errorMessage).toBe('one or more required field missing');
        });
        it('should call resource if data is ok', function() {
            $httpBackend.expect(
                "PUT",
                "{0}/api/me".format([appConfig.backendURL]),
                user
            ).respond(200, {name: 'Updated User Name', email: 'test2@user.com', pivotalToken: 'TOO-KEN'});
            $scope.user.email = user.email;
            $scope.user.name = user.name;
            $scope.user.pivotalToken = user.pivotalToken;
            $scope.updateUser();
            $httpBackend.flush();
            expect($scope.user.name).toBe('Updated User Name');
            expect($scope.user.email).toBe('test2@user.com');
            expect($scope.user.pivotalToken).toBe('TOO-KEN');
        });
        it('should flag update is complete', function() {
            $httpBackend.expect(
                "PUT",
                "{0}/api/me".format([appConfig.backendURL]),
                {}
            ).respond(200, {name: 'Updated User Name', email: 'test2@user.com', pivotalToken: 'TOO-KEN'});
            $scope.updateUser();
            $httpBackend.flush();
            expect($scope.updateComplete).toBeTruthy();
        });
        it('should flag update is failed on error', function() {
            $httpBackend.expect(
                "PUT",
                "{0}/api/me".format([appConfig.backendURL]),
                {}
            ).respond(400, {errorMessage: 'Invalid Data'});
            $scope.updateUser();
            $httpBackend.flush();
            expect($scope.updateFail).toBeTruthy();
            expect($scope.errorMessage).toBe('Invalid Data');
        });
    });
    describe('Changing password', function() {
        var $scope, user;
        beforeEach(function() {
            $scope = $rootScope.$new();
            $scope.formPassword = {
                $invalid: false
            };
            user = {name: 'User Name', pivotalToken: 'PIVOTAL-TOKEN', email: 'user@test.com'};
            $httpBackend.expect('GET', '{0}/api/me'.format([appConfig.backendURL])).respond(200, user);
            $controller('ShowUserController', {$scope: $scope});
            $scope.password = {new: 'new-password', confirm: null};
        });
        it('should flag change fail if form is invalid', function() {
            $scope.formPassword.$invalid = true;
            $scope.changePassword();
            expect($scope.changePasswordFail).toBeTruthy();
            expect($scope.errorMessage).toBe('invalid form data');
        });
        it('should clear form form is invalid', function() {
            $scope.formPassword.$invalid = true;
            $scope.changePassword();
            expect($scope.password).toEqual({new: null, confirm: null});
        });
        it('should call resource if data is ok', function() {
            $httpBackend.expect(
                "PUT",
                "{0}/api/me".format([appConfig.backendURL]),
                {password: 'new-password'}
            ).respond(200, {result: 'success'});
            $scope.changePassword();
            $httpBackend.flush();
        });
        it('should flag change is complete', function() {
            $httpBackend.expect(
                "PUT",
                "{0}/api/me".format([appConfig.backendURL]),
                {password: 'new-password'}
            ).respond(200, {name: 'Updated User Name', email: 'test2@user.com', pivotalToken: 'TOO-KEN'});
            $scope.changePassword();
            $httpBackend.flush();
            expect($scope.changePasswordComplete).toBeTruthy();
        });
        it('should clean model on complete', function() {
            $httpBackend.expect(
                "PUT",
                "{0}/api/me".format([appConfig.backendURL]),
                {password: 'new-password'}
            ).respond(200, {name: 'Updated User Name', email: 'test2@user.com', pivotalToken: 'TOO-KEN'});
            $scope.changePassword();
            $httpBackend.flush();
            expect($scope.password).toEqual({new: null, confirm: null});
        });
        it('should flag change is failed on error', function() {
            $httpBackend.expect(
                "PUT",
                "{0}/api/me".format([appConfig.backendURL]),
                {password: 'new-password'}
            ).respond(400, {errorMessage: 'Invalid Data'});
            $scope.changePassword();
            $httpBackend.flush();
            expect($scope.changePasswordFail).toBeTruthy();
            expect($scope.errorMessage).toBe('Invalid Data');
        });
        it('should clean password on error', function() {
            $httpBackend.expect(
                "PUT",
                "{0}/api/me".format([appConfig.backendURL]),
                {password: 'new-password'}
            ).respond(400, {errorMessage: 'Invalid Data'});
            $scope.changePassword();
            $httpBackend.flush();
            expect($scope.password).toEqual({new: null, confirm: null});
        });
    });
});