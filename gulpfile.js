var gulp = require('gulp'),
    // 加载gulp-load-plugins插件，并马上运行它
    // 自动加载 package.json中的依赖库
    // usage: less() -> plugins.less()
    plugins = require('gulp-load-plugins')();
//cleanCss = require('gulp-clean-css');
// less = require('gulp-less'), // less
// cleanCss = require('clean-css'),  // CSS压缩
// uglify = require('gulp-uglify'),     // js压缩
// rename = require('gulp-rename');        // 重命名
 
var coreJsSrc = [];

var lessSrc = ['./static/src/**/*.less', '!./static/src/lib/**/*.less'],
 
    // 页面 css 
    pageLessSrc = ['./static/src/page/**/*.less'],

    // 外部库js 直接复制 
    libJsSrc = ['./static/src/lib/**/*.js'],

    // 页面js 先编译、压缩
    pageJsSrc = ['./static/src/page/**/*.js', '!./static/src/page/**/*.babel.js', '!./static/src/page/**/*.min.js'];
   
// 页面 less -> dist/css/page/**.css & .min.css
gulp.task('pageLess', function () {
    gulp.src(pageLessSrc)
        .pipe(plugins.less())
        // 本地调试用css
        .pipe(gulp.dest(function (r) {
            return r.base;
        }))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.cleanCss({ compatibility: 'ie8' }))
        .pipe(gulp.dest('static/dist/page'))   // 线上发布.min.css
});
 
 
// 直接复制外部js库 /lib/
gulp.task("libJs", function () {
    gulp.src(libJsSrc)
        .pipe(gulp.dest('./static/dist/lib'))
});

// 编译并压缩页面js /page/
gulp.task("pageJs", function () {
    gulp.src(pageJsSrc)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.babel({
            presets: ['es2015'] // es6 -> es5
        })) 
        //.pipe(plugins.rename({ suffix: '.babel' }))
        //.pipe(gulp.dest('wwwroot/dist/js/page'))
        .pipe(plugins.rename({ suffix: '.babel.min' })) //         
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write("."))        // 输出sourcemaps
        .pipe(gulp.dest('./static/dist/page'))       // 目标路径       
});

 

 
gulp.task('default', function () {
    gulp.watch(pageLessSrc, ['pageLess']);  
    gulp.watch(libJsSrc, ['libJs']);
    gulp.watch(pageJsSrc, ['pageJs']); 
});