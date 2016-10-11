var gulp = require('gulp'),
    ts = require("gulp-typescript"),
    del = require("del"),
    server = require("gulp-express");

var tsProject = ts.createProject("tsconfig.json");

gulp.task("clean", function() {
    return del(['build/js']);
});

gulp.task("compile-ts", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("build"));
});

gulp.task("server", function() {
    server.run(['modules/server/app.js']);

    gulp.watch(['modules/client/templates/*.html'], server.notify);
    // gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
    //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]); 
    //Event object won't pass down to gulp.watch's callback if there's more than one of them. 
    //So the correct way to use server.notify is as following: 
    // gulp.watch(['{.tmp,app}/styles/**/*.css'], function(event){
    //     gulp.run('styles:css');
    //     server.notify(event);
    //     //pipe support is added for server.notify since v0.1.5, 
    //     //see https://github.com/gimm/gulp-express#servernotifyevent 
    // });
 
    // gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    // gulp.watch(['app/images/**/*'], server.notify);
    // gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
});

gulp.task('default', ['clean'], function() {
    gulp.start('compile-ts');
});