module.exports = function(config) {
    var configObj = {
        basePath: './',
        preprocessors: {
          'app/templates/**/*.html': ['ng-html2js'],
          'app/www/static/js/app/**/*.js': ['coverage']
        },
        ngHtml2JsPreprocessor: {
            cacheIdFromPath: function(filepath) {
                var cacheId = filepath.split('/templates/');
                return 'url-back-end/templates/' + cacheId[1];
            },
            moduleName: 'app-templates'
         },
        files: [
            "bower_components/angular/angular.js",
            "bower_components/angular-route/angular-route.js",
            'bower_components/angular-mocks/angular-mocks.js',
            "bower_components/angular-resource/angular-resource.js",
            "bower_components/jquery/dist/jquery.js",
            "bower_components/jquery-ui/jquery-ui.js",
            "bower_components/angular-dragdrop/src/angular-dragdrop.js",
            "bower_components/bootstrap-sass/assets/javascripts/bootstrap.js",
            'app/www/static/js/app/**/*.js',
            'tests/js_unit/**/*.js',
            'app/www/templates/**/*.html'
        ],
        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        reporters: ['progress'],
        coverageReporter: {
            type: 'lcov',
            dir: '.k_coverage/'
        },
        customLaunchers: {
           Chrome_travis_ci: {
               base: 'Chrome',
               flags: ['--no-sandbox']
           }
        }
    };
    if (process.env.TRAVIS) {
        configObj.browsers = ['Chrome_travis_ci'];
        configObj.reporters = ['progress', 'coverage'];
    }
    config.set(configObj);
};
