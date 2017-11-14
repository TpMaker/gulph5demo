/**
 *  插件库：http://gulpjs.com/plugins/
 */

// 引入组件
var less = require('gulp-less'), // less
    minifycss = require('gulp-minify-css'), // CSS压缩
    uglify = require('gulp-uglify'), // js压缩
    imagemin = require('gulp-imagemin'), //图片压缩
    concat = require('gulp-concat'), // 合并文件
    rename = require('gulp-rename'), // 重命名
    clean = require('gulp-clean'), //清空文件夹
    notify = require('gulp-notify'), //更改提醒
    jshint = require('gulp-jshint'), //js代码校验
    cache = require('gulp-cache'),
    jade = require('gulp-jade'), //jade模板
    gulpif = require('gulp-if'),
    //csslint = require('gulp-csslint'),
    htmlhint = require("gulp-htmlhint"),
    jscs = require('gulp-jscs'),
    stylish = require('gulp-jscs-stylish'),
    htmlmin = require('gulp-htmlmin'),
    usemin = require('gulp-usemin'), //静态资源整合
    revReplace = require("gulp-rev-replace"),
    rev = require('gulp-rev'),
    RevAll = require('gulp-rev-all'),
    cleanCSS = require('gulp-clean-css'),
    scsslint = require('gulp-scss-lint')
    newer = require('gulp-newer'), //缓存，只有替换了才压缩
    browserSync = require('browser-sync'), //自动刷新页面
    proxyMiddleware = require('http-proxy-middleware'), //代理中间件
    fs = require('fs'),
    path = require('path'),
    argv = require('yargs').argv;

var fmpp = require('./fmpp.js');

module.exports = function(config, gulp, proxyConfig) {
    var evr = false;
    gulp = gulp || require('gulp');

    // less解析
    gulp.task('less', function() {
        gulp.src(config.assets.less)
            .pipe(newer(config.output.remote + '/css'))
            .pipe(less({
                paths: [path.join(__dirname, 'less', 'includes')]
            }))
            .pipe(minifycss({
                keepBreaks: !evr
            }))
            //.pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(config.output.remote + '/css'));
    });

    //css 压缩
    gulp.task('css', function() {
        gulp.src(config.assets.css)
            //.pipe(newer(config.output.remote + '/css'))
            //.pipe(csslint())
            //.pipe(csslint.reporter())
            .pipe(minifycss({
                keepBreaks: !evr
            }))
            .pipe(gulp.dest(config.output.remote + '/css'));
    });

    //js task
    gulp.task('js', function() {
        console.log('js evr', evr);
        //deploy
        if (evr) {
            gulp.src(config.assets.js)
                .pipe(uglify())
                .pipe(gulp.dest(config.output.remote + '/js'));
        } else {
            gulp.src(config.assets.js)
                //.pipe(newer(config.output.remote + '/js'))
                //.pipe(jshint())
                //.pipe(jshint.reporter('jshint-stylish'))
                .pipe(gulp.dest(config.output.remote + '/js'));
        }

    });

    //js task
    gulp.task('jsmin', function() {
        console.log('jsmin evr', evr);
        if (evr) {
            gulp.src(config.assets.js)
                .pipe(gulpif(evr, uglify()))
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(gulp.dest(config.output.remote + '/js'));
        } else {
            gulp.src(config.assets.js)
                .pipe(newer(config.output.remote + '/js'))
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(gulp.dest(config.output.remote + '/js'));
        }
    });

    gulp.task('jscs', () => {
        return gulp.src(config.assets.js)
            .pipe(jscs())
            .pipe(jscs.reporter());
    });

    //js check
    gulp.task('jshint', ['jscs'], function() {
        gulp.src(config.assets.js)
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'));
    });

    //压缩图片
    gulp.task('images', function() {
        //console.log(evr);
        return gulp.src(config.assets.img)
            .pipe(gulpif(config.evr, newer(config.output.remote + '/images')))
            //.pipe(  imagemin([imagemin.gifsicle(), imagemin.jpegtran({progressive:true}), imageminPngquant({quality: '65-80'}), imagemin.svgo()],{
            .pipe(imagemin([imagemin.gifsicle(), imagemin.jpegtran({
                progressive: true
            }), imagemin.optipng({
                optimizationLevel: 4
            }), imagemin.svgo()], {
                optimizationLevel: 1,
                progressive: true,
                interlaced: true
            }))
            .pipe(gulp.dest(config.output.remote + '/images'));
    });

    //清空生成文件*.css,*.js
    var opt = [config.output.remote + '/css/*', config.output.remote + '/js/*', config.output.remote + '/img/*', config.output.remote + '/html/*'];
    gulp.task('clean', function() {
        return gulp.src(opt, {
                read: false
            })
            .pipe(clean());
    });

    //jade模板
    gulp.task('jade', function() {
        var YOUR_LOCALS = {};
        gulp.src(config.assets.jade)
            .pipe(jade({
                locals: YOUR_LOCALS,
                pretty: true
            }))
            .pipe(gulp.dest(config.output.local));
    });


    //生成代理列表
    function makeProxyWare(middleware) {
        middleware = middleware || [];
        Object.keys(proxyConfig.proxyTable).forEach(function(context) {
            var options = proxyConfig.proxyTable[context]
            if (typeof options === 'string') {
                options = {
                    target: options,
                    changeOrigin: true
                }
            }
            //console.log(context, options);
            middleware.push(proxyMiddleware(context, options));
        });

        if (middleware.length === 0) {
            middleware.push(proxyMiddleware("/*", {
                target: 'http://rap.taobao.org/mockjsdata/5911',
                changeOrigin: true
            }));
        }
        return middleware;
    }
    //启动本地服务，监听
    gulp.task('chrome', function() {

        var options = {
            server: {
                baseDir: config.output.local,
                middleware: [],
                routes: {
                    '/': '/login.html'
                }
            },
            ui: {
                port: (config.output.port || 3000) + 1
            },
            port: config.output.port || 3000
                //logLevel: 'debug'
                /*proxy: {
                    target: "http://rap.taobao.org/mockjsdata/5911",
                    proxyRes: [
                        function(proxyRes, req, res) {
                            console.log(proxyRes.headers);
                        }
                    ]
                }*/
        };
        makeProxyWare(options.server.middleware);
        browserSync.init(config.assets.html, options);

        gulp.watch(config.assets.js).on('change', browserSync.reload);
        gulp.watch(config.assets.scss).on('change', browserSync.reload);
        gulp.watch(config.assets.html).on('change', browserSync.reload);
    });

    //自动刷新页面
    gulp.task('reload', function() {
        browserSync.reload();
    });

    //sass
    // gulp.task('sass', function() {
    //     gulp.src(config.assets.scss)
    //         .pipe(newer(config.output.remote + '/css'))
    //         .pipe(sass.sync().on('error', sass.logError))
    //         .pipe(sass({
    //             outputStyle: 'compact'
    //         })) //CSS output style (nested | expanded | compact | compressed)
    //         .pipe(minifycss({
    //             keepBreaks: !evr
    //         }))
    //         .pipe(gulp.dest(config.output.remote + '/css'))
    // });

    // gulp.task('sass:watch', function() {
    //     gulp.watch(config.assets.scss, ['sass']);
    // });

    //htmlhint语法检查
    gulp.task('htmlhint', function() {
        gulp.src(config.assets.html)
            .pipe(htmlhint())
            .pipe(htmlhint.reporter())
            .pipe(htmlhint.failReporter({
                suppress: true
            }));
    });

    //压缩ftl文件，html文件
    gulp.task('minify:complie', function() {
        return gulp.src(config.assets.fmpp[0])
            .pipe(htmlmin({
                collapseWhitespace: true,
                //collapseInlineTagWhitespace: true,
                //preserveLineBreaks: true,
                //removeComments: true,
                minifyJS: true,
                ignoreCustomFragments: [/<%[\s\S]*?%>/, /<@[\s\S]*?>/, /\$\{[\s\S]*?\}/, /<\?[\s\S]*?\?>/, /<#[\s\S]*?>[\s\S]*?<\/#[\s\S]*?>/, /<#[\s\S]*?>/, /<\/#[\s\S]*?>/]
            }))
            .pipe(gulp.dest('build/'));
    });
    gulp.task('minify', function() {
        gulp.watch([config.assets.fmpp[0]], ['minify:complie']);
    });
    //ftl文件，html文件静态资源hash
    gulp.task('usemin:complie', function() {
        return gulp.src([config.assets.fmpp[0]])
            .pipe(usemin({
                css: [rev()],
                html: [htmlmin({
                    collapseWhitespace: true,
                    ignoreCustomFragments: [/<%[\s\S]*?%>/, /<@[\s\S]*?>/, /\$\{[\s\S]*?\}/, /<\?[\s\S]*?\?>/, /<#[\s\S]*?>[\s\S]*?<\/#[\s\S]*?>/, /<#[\s\S]*?>/, /<\/#[\s\S]*?>/]
                })],
                js: [uglify(), rev()],
                inlinejs: [uglify()],
                inlinecss: [cleanCSS(), 'concat']
            }))
            .pipe(gulp.dest('build/'));
    });
    gulp.task('usemin', function() {
        gulp.watch([config.assets.fmpp[0]], ['usemin:complie']);
    });

    //生成静态资源映射表['deploy'],
    gulp.task('revision', function() {
        var revAll = new RevAll({
            dontRenameFile: ['.ftl', '.html', '.json']
        });
        return gulp.src(['dist/**'])
            .pipe(revAll.revision())
            .pipe(gulp.dest('build/'))
            .pipe(revAll.manifestFile())
            .pipe(gulp.dest('build/'))
    });
    //替换静态资源
    gulp.task('rev', ['revision'], function() {
        var manifest = gulp.src('./build/' + '/rev-manifest.json');

        return gulp.src([config.assets.fmpp[0], 'dist/**/*.js', 'dist/**/*.css'])
            .pipe(revReplace({
                manifest: manifest,
                replaceInExtensions: ['.js', '.css', '.html', '.ftl']
            }))
            .pipe(gulp.dest('build/'));
    });

    // fmpp编译freemarker
    gulp.task('fmpp:compile', function() {
        fmpp.travelDir('./' + config.assets.ftl, function(pathname) {
            if (path.extname(pathname) === '.ftl' && path.dirname(pathname).indexOf('components') < 0 && pathname.indexOf('.tmp.ftl') === -1 && pathname.indexOf('global_library') == -1) {
                fmpp.execFmpp(pathname, config.assets.ftl, config.fmppData, proxyConfig);
            }
        });
    });
    //监听ftl文件并自动编译
    gulp.task('fmpp', ['fmpp:compile'], function() {
        gulp.watch(config.assets.fmpp, function(event) {
            var pathname = event.path;
            var index = pathname.indexOf('src');
            pathname = pathname.slice(index);

            // common下的ftl不编译
            if (path.dirname(pathname).indexOf('common') < 0 && path.dirname(pathname).indexOf('components') < 0 && pathname.indexOf('.tmp.ftl') === -1 && pathname.indexOf('global_library') == -1) {
                fmpp.execFmpp(pathname, config.assets.ftl, config.fmppData, proxyConfig);
            }
        });
    });

    /*var checkimage = require('./tools/gulp-imagecheck.js');
    gulp.task('checkimage',function(){
        return gulp.src(config.assets.img).
        pipe(checkimage({imageSize:50000}));
    })*/

    //监听文件,当文件修改时执行task
    gulp.task('watch', function() {
        gulp.watch(config.assets.jade, ['jade']);
        gulp.watch(config.assets.less, ['less']);
        gulp.watch(config.assets.js, ['compress']);
        gulp.watch(config.assets.img, ['images']);
        gulp.watch(config.assets.css, ['css']);
        // gulp.watch(config.assets.scss, ['sass']);
    });

    //检查config remote是否设置正确
    fmpp.checkPath(config);

    //set env to prod
    gulp.task('setprod', function() {
        evr = true;
        config.evr = true;
    });

    gulp.task('lintscss', () => {
        return lintSCSS(config.assets.scss)
    });

    function lintJS(file) {
        gulp.src(file)
            .pipe(jshint())
            //.pipe(jscs())
            //.pipe(stylish.combineWithHintResults())
            .pipe(jshint.reporter('jshint-stylish'));
    }

    function lintSCSS (file) {
        gulp.src(file)
            .pipe(scsslint({config: __dirname + '/.scss-lint.yml'}))

    }
    return {
        lintJS: lintJS,
        lintSCSS: lintSCSS
    };
};
