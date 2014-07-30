var gulp = require('gulp');
var path = require('path');
var plugins = require("gulp-load-plugins")({
    lazy: false
});

gulp.task('scripts', function() {
    //combine all js files of the app
    gulp.src(['!./app/**/*_test.js', '!./app/assets/**/*.js', './app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.ngAnnotate())
    //.pipe(plugins.uglify())
    .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest('../server/public/assets/javascripts'));
});

gulp.task('less', function() {
    //combine all js files of the app
    gulp.src('./app/styles/master.less')
        .pipe(plugins.less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(plugins.concat('styles.min.css'))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('../server/public/assets/stylesheets'));
});

gulp.task('templates', function() {
    //combine all template files of the app into a js file
    gulp.src('./app/**/*.html')
        .pipe(plugins.angularTemplatecache('templates.js', {
            standalone: true
        }))
        .pipe(gulp.dest('../server/public/assets/javascripts'));
});

gulp.task('vendorJS', function() {
    //concatenate vendor JS files
    gulp.src([
        './bower_components/jquery/jquery.js',
        './bower_components/angular/angular.js',
        './bower_components/angular-animate/angular-animate.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/angular-bootstrap/ui-bootstrap-0.11.1.js',
        './bower_components/angular-bootstrap/ui-bootstrap-tpls-0.11.1.js',
        './bower_components/ng-grid/build/ng-grid.js',
        './bower_components/ng-simplePagination/simplePagination.js',
        './bower_components/ng-clip/src/ngClip.js',
        './bower_components/zeroclipboard/dist/ZeroClipboard.js',
        './bower_components/chartjs/Chart.js',
        './bower_components/angles/angles.js'
    ])
        .pipe(plugins.concat('lib.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('../server/public/assets/javascripts'));

    gulp.src('./bower_components/zeroclipboard/dist/ZeroClipboard.swf')
        .pipe(gulp.dest('../server/public/assets'));
});

gulp.task('watch', function() {
    gulp.watch([
        '../server/public/**/*.html',
        '../server/public/**/*.css',
        '../server/public/**/*.js',
        '../server/**/*.rb'
    ], function(event) {
        return gulp.src(event.path)
            .pipe(plugins.connect.reload());
    });
    gulp.watch(['./app/**/*.less'], ['less']);
    gulp.watch(['./app/**/*.js', '!./app/**/*test.js'], ['scripts']);
    gulp.watch(['!./app/index.html', './app/**/*.html'], ['templates']);

});

gulp.task('connect', function() {
    plugins.connect.server({
        root: ['../server/public'],
        port: 9000,
        livereload: true
    });
});

gulp.task('bower', function() {
    return plugins.bower()
        .pipe(gulp.dest('./bower_components'));
});

gulp.task('build', ['less', 'scripts', 'templates', 'vendorJS']);
gulp.task('default', ['connect', 'less', 'scripts', 'templates', 'vendorJS', 'watch']);
