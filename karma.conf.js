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
            "bower_components/bootstrap-sass/assets/javascripts/bootstrap.js",
            'app/www/static/js/app/**/*.js',
            'tests/js_unit/**/*.js',
            'app/templates/**/*.html'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-ng-html2js-preprocessor'
        ],
        customLaunchers: {
           Chrome_travis_ci: {
               base: 'Chrome',
               flags: ['--no-sandbox']
           }
        }
    };
    if (process.env.TRAVIS) {
        configObj.browsers = ['Chrome_travis_ci'];
    }
    config.set(configObj);
};
