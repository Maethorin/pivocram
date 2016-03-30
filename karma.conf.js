module.exports = function(config) {
    config.set({

        basePath: './',
        preprocessors: {
          'app/templates/**/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {
            cacheIdFromPath: function(filepath) {
                var cacheId = filepath.split('/templates/');
                return 'url-back-end/angular/' + cacheId[1];
            },
            moduleName: 'app-templates'
         },
        files: [
            "bower_components/moment/moment.js",
            "bower_components/moment/locale/pt-br.js",
            "bower_components/lodash/dist/lodash.js",
            "bower_components/angular/angular.js",
            "bower_components/angular-ui-mask/dist/mask.js",
            "bower_components/angular-route/angular-route.js",
            'bower_components/angular-mocks/angular-mocks.js',
            "bower_components/angular-resource/angular-resource.js",
            "bower_components/angular-cookies/angular-cookies.js",
            "bower_components/angular-simple-logger/dist/angular-simple-logger.js",
            "bower_components/angular-recaptcha/release/angular-recaptcha.js",
            "bower_components/angular-google-maps/dist/angular-google-maps.js",
            "bower_components/ng-file-upload/ng-file-upload.js",
            "bower_components/jquery/dist/jquery.js",
            "bower_components/bootstrap-sass/assets/javascripts/bootstrap.js",
            'app/static/js/common.js',
            'app/static/js/app/**/*.js',
            'tests/js_unit/**/*.js',
            'app/templates/**/*.html'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor'
        ]

    });
};
