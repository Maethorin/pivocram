exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        'tests/e2e/**/*.js'
    ],
    capabilities: {
        'browserName': 'chrome'
    },
    baseUrl: 'http://127.0.0.1:8000/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};