describe('General functions', function() {
    describe('format string', function() {
        it('should format string with array', function () {
            expect(format("String {0} be {1}", ["to", "formatted"])).toBe("String to be formatted")
        });
        it('should format string with object', function () {
            expect(format("String {to} be {formatted}", {to: "to", formatted:"formatted"})).toBe("String to be formatted")
        });
        it('should format string in prototype', function () {
            expect("String {0} be {1}".format(["to", "formatted"])).toBe("String to be formatted")
        })
    });
    describe('setBackgroundURL', function () {
        it('should point to heroku by default', function () {
            var location = {hostname: 'anywhere'};
            expect(setBackendURL(location)).toBe('https://pivocram.herokuapp.com')
        });
        it('should point to localhost:5000 if in localhost', function () {
            var location = {hostname: 'localhost', port: '5000'};
            expect(setBackendURL(location)).toBe('http://localhost:5000')
        });
        it('should point to localhost:5000 if in 127.0.0.1', function () {
            var location = {hostname: '127.0.0.1'};
            expect(setBackendURL(location)).toBe('http://localhost:5000')
        });
    })
});

describe('App common', function() {
    var appConfig;
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_appConfig_) {
        appConfig = _appConfig_;
    }));
    describe('appConfig', function () {
        it('should have backendURL', function () {
            expect(appConfig.backendURL).toBeDefined();
        });
        it('should get the value of setBackendURL', function () {
            expect(appConfig.backendURL).toBe('https://pivocram.herokuapp.com');
        });
    });
});