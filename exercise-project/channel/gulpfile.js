var gulp = require('gulp');
var gulpconfig = require('./config/gulpconfig');
// 引入组件
var px2rem = require('gulp-px2rem'),
    less = require('gulp-less'), // less
    rename = require('gulp-rename'), // 重命名
    minifycss = require('gulp-minify-css'), // CSS压缩
    gulpif = require('gulp-if'),
    newer = require('gulp-newer'), //缓存，只有替换了才压缩
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'), //js代码校验
    imagemin = require('gulp-imagemin'), //图片压缩
    browserSync = require('browser-sync'), //自动刷新页面
    autoprefixer = require('gulp-autoprefixer');


//配置文件
var config = {
    //是否压缩
    isZiped: false,
    // 静态资源引入
    assets: {
        less: './src/less/ui/**/*.less',
        js: './src/js/**/*.js',
        img: './src/images/**/*',
        htm: './src/js/**/*.htm'
    },
    output: {
        remote: gulpconfig.remote
    }
};

// less解析 重写此task
gulp.task('less', function() {
    gulp.src([config.assets.less])
        .pipe(gulpif(!config.isZiped, newer(config.output.remote + '/css')))
        .pipe(less())
        .pipe(autoprefixer('Android >= 4', 'Chrome >= 40', 'last 6 Firefox versions', 'iOS >= 6', 'Safari >= 6'))
        .pipe(px2rem({
            replace: true,
            rootValue: 75
        }))
        .pipe(gulpif(config.isZiped, minifycss()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.output.remote + '/css'));
});

gulp.task('js',function(){
    gulp.src(config.assets.js)
        .pipe(jshint())
        .pipe(gulp.dest(config.output.remote + '/js'))
})

gulp.task('images', function() {
    gulp.src(config.assets.img)
       //.pipe(imagemin())
       .pipe(gulp.dest(config.output.remote + '/images'));
});

// JS Build with R.js
gulp.task('rjsBuild', function() {
    require('./config/rjsConfig')(config);
});

//监听文件,当文件修改时执行task
gulp.task('watch', function() {
   gulp.start('images', 'less', 'rjsBuild');
   gulp.watch(config.assets.less, ['less']);
   gulp.watch(config.assets.img, ['images']);
   var watcher = gulp.watch(config.assets.js, ['rjsBuild']);
   watcher.on('change', function(event) {
      gulp.src(event.path)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
   });
});

gulp.task('deploy', function() {
    gulp.start('images', 'less', 'rjsBuild');
});

