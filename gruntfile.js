module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            components: {
                src: [
                    "bower_components/angular/angular.js",
                    "bower_components/angular-route/angular-route.js",
                    "bower_components/angular-resource/angular-resource.js",
                    "bower_components/jquery/dist/jquery.js",
                    "bower_components/jquery-ui/jquery-ui.js",
                    "bower_components/angular-dragdrop/src/angular-dragdrop.js",
                    "bower_components/bootstrap-sass/assets/javascripts/bootstrap.js"
                ],
                dest: 'app/www/static/js/components.js'
            },
            app: {
                src: [
                    "app/www/static/js/common.js",
                    "app/www/static/js/app/**/*.js"
                ],
                dest: 'app/www/static/js/app.js'
            }
        },
        uglify: {
            options: {},
            components: {
                files: {
                    'app/www/static/js/components.min.js': ['<%= concat.components.dest %>']
                }
            },
            app: {
                files: {
                    'app/www/static/js/app.min.js': ['<%= concat.app.dest %>']
                }
            }
        },
        compass: {
            app: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        watch: {
            app: {
                files: '<%= concat.app.src %>',
                tasks: ['concat:app', 'uglify:app']
            },
            css: {
                files: 'sass/**/*.scss',
                tasks: ['compass:app']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.registerTask('default', ['concat', 'uglify', 'watch', 'compass']);
    grunt.registerTask('heroku', ['concat:app', 'uglify:app', 'concat:components', 'uglify:components', 'compass:app']);
};