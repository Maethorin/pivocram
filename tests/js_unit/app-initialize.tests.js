describe('General functions', function() {
    describe('format string', function() {
        it('should format string with array', function() {
            expect(format("String {0} be {1}", ["to", "formatted"])).toBe("String to be formatted")
        });
        it('should format string with object', function() {
            expect(format("String {to} be {formatted}", {
                to: "to",
                formatted: "formatted"
            })).toBe("String to be formatted")
        });
        it('should format string in prototype', function() {
            expect("String {0} be {1}".format(["to", "formatted"])).toBe("String to be formatted")
        })
    });
    describe('setBackgroundURL', function() {
        it('should point to heroku by default', function() {
            var location = {hostname: 'anywhere'};
            expect(setBackendURL(location)).toBe('https://pivocram.herokuapp.com')
        });
        it('should point to localhost:5000 if in localhost', function() {
            var location = {hostname: 'localhost', port: '5000'};
            expect(setBackendURL(location)).toBe('http://localhost:5000')
        });
        it('should point to localhost:5000 if in 127.0.0.1', function() {
            var location = {hostname: '127.0.0.1'};
            expect(setBackendURL(location)).toBe('http://localhost:5000')
        });
    })
});

describe('App common', function() {
    var $location, $sceDelegate, appConfig, AuthService, updateToken;
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$location_, _$sceDelegate_, _appConfig_, _AuthService_, _updateToken_) {
        $location = _$location_;
        $sceDelegate = _$sceDelegate_;
        appConfig = _appConfig_;
        AuthService = _AuthService_;
        updateToken = _updateToken_;
    }));
    describe('appConfig', function() {
        it('should have backendURL', function() {
            expect(appConfig.backendURL).toBeDefined();
        });
        it('should get the value of setBackendURL', function() {
            expect(appConfig.backendURL).toBe('https://pivocram.herokuapp.com');
        });
    });
    describe('updating token', function() {
        it('should update AuthService if there is a XSRF-TOKEN in response header', function() {
            var authSpy = spyOn(AuthService, 'update');
            var response = {
                headers: function() {
                    return {
                        'XSRF-TOKEN': 'TOOOOOKEEEN',
                        'USER-NAME': 'User Name'
                    }
                }
            };
            updateToken.response(response);
            expect(authSpy).toHaveBeenCalledWith('TOOOOOKEEEN', 'User Name')
        });
        it('should clear AuthService data if response status code is 401', function() {
            var authSpy = spyOn(AuthService, 'clear');
            spyOn($location, 'path').and.returnValue('/login');
            var response = {
                status: 401
            };
            updateToken.responseError(response);
            expect(authSpy).toHaveBeenCalled()
        });
        it('should redirect to login if get a 401 response status code and are not in login page', function() {
            var locationSpy = spyOn($location, 'path');
            locationSpy.and.returnValue('/elsewhere');
            var response = {
                status: 401
            };
            updateToken.responseError(response);
            expect(locationSpy.calls.argsFor(1)).toEqual(['/login'])
        });
        it('should add XSRF-TOKEN in request header', function() {
            AuthService.token = 'TOOOOKEEEEN';
            var config = {
                headers: {}
            };
            updateToken.request(config);
            expect(config.headers['XSRF-TOKEN']).toBe('TOOOOKEEEEN')
        });
    });
});