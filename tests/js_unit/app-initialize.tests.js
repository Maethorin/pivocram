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
    describe('padding left number', function() {
        it('should pad with 0', function() {
            var toBeFormted = 123;
            expect(toBeFormted.paddingLeft(6)).toBe('000123')
        });
        it('should pad with char', function() {
            var toBeFormted = 13;
            expect(toBeFormted.paddingLeft(4, '-')).toBe('--13')
        });
        it('should do nothing if number length is bigger than padded result', function() {
            var toBeFormted = 12233;
            expect(toBeFormted.paddingLeft(4, '-')).toBe('12233')
        });
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
    });
    describe('configApp', function() {
        var $sceDelegateProvider, $httpProvider, appConfig;
        beforeEach(function() {
            $sceDelegateProvider = {
                whiteList: [],
                resourceUrlWhitelist: function(whiteList) {
                    this.whiteList = whiteList;
                }
            };
            $httpProvider = {
                defaults: {
                    withCredentials: false
                },
                interceptors: []
            };
            appConfig = {
                backendURL: 'back-end/url'
            }
        });
        it('should define $sce app', function() {
            configApp($sceDelegateProvider, $httpProvider, appConfig);
            expect($sceDelegateProvider.whiteList).toEqual(['self', 'back-end/url/**']);
        });
        it('should define $httpProvider app withCredentials', function() {
            configApp($sceDelegateProvider, $httpProvider, appConfig);
            expect($httpProvider.defaults.withCredentials).toBeTruthy();
        });
        it('should define $httpProvider app interceptors', function() {
            configApp($sceDelegateProvider, $httpProvider, appConfig);
            expect($httpProvider.interceptors).toEqual(['updateToken']);
        });
    });
    describe('runApp', function() {
        var $rootScope, appConfig, AuthService;
        beforeEach(function() {
            $rootScope = {
                name: null,
                callback: null,
                $on: function(name, callback) {
                    this.name = name;
                    this.callback = callback;
                }
            };
            AuthService = {
                updated: false,
                update: function() {
                    this.updated = true;
                }
            };
            appConfig = {
                backendURL: 'back-end/url'
            }
        });
        it('should update AuthService', function() {
            runApp($rootScope, appConfig, AuthService);
            expect(AuthService.updated).toBeTruthy();
        });
        it('should set referrer', function() {
            runApp($rootScope, appConfig, AuthService);
            expect($rootScope.referrer).toBeDefined();
            expect($rootScope.referrer).toBeNull();
        });
        it('should sign $locationChangeSuccess', function() {
            runApp($rootScope, appConfig, AuthService);
            expect($rootScope.name).toBe('$locationChangeSuccess');
        });
        it('should set referrer on change', function() {
            runApp($rootScope, appConfig, AuthService);
            $rootScope.callback(null, '', 'nice-url');
            expect($rootScope.referrer).toBe('nice-url');
        });
        it('should not set referrer on url has login', function() {
            runApp($rootScope, appConfig, AuthService);
            $rootScope.callback(null, '', 'some-url-with-login');
            expect($rootScope.referrer).toBeNull();
        });
        it('should not set referrer without backendURL', function() {
            runApp($rootScope, appConfig, AuthService);
            $rootScope.callback(null, '', '{0}/#/with-backend'.format([appConfig.backendURL]));
            expect($rootScope.referrer).toBe('/with-backend');
        });
    });
});

describe('App common', function() {
    var $location, $sceDelegate, $rootScope, appConfig, AuthService, updateToken;
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$location_, _$sceDelegate_, _$rootScope_, _appConfig_, _AuthService_, _updateToken_) {
        $location = _$location_;
        $sceDelegate = _$sceDelegate_;
        $rootScope = _$rootScope_;
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