var rjs = require('requirejs'),
    fs = require('fs'),
    path = require('path'),
    gulpif = require('gulp-if');

module.exports = function(config) {
    var arr_modules = [];
    function travel(dir, callback) {
        fs.readdirSync(dir).forEach(function (file) {
            var pathname = path.join(dir, file);
            if (fs.statSync(pathname).isDirectory()) {
                travel(pathname, callback);
            } else {
                var fileExt = pathname.slice(-3);
                if(fileExt === '.js'){
                    pathname = pathname.slice(0, -3);
                    var pathArr = pathname.split(path.sep).slice(2);
                    pathname = pathArr.join('/');
                    callback(pathname);
                    return false;
                }
            }
        });
    }

    travel('./src/js/page', function(file) {
        arr_modules.push({
            //module names are relative to baseUrl/paths config
            name: file
        });
    });
    console.log(arr_modules);
    console.log('读取列表成功');

    rjs.optimize({
        baseUrl: './src/js',
        dir: config.output.remote + '/js',
        optimize: gulpif(config.isZiped, 'uglify2', 'none'),
        //寻找内嵌依赖性
        findNestedDependencies: true,
        fileExclusionRegExp: /^node_modules$/,
        //保留注释
        preserveLicenseComments: false,
        urlArgs: "version=20150814001",
        paths: {
            zepto: 'vendor/zepto',
            swiper: 'vendor/swiper.min',
            iscroll: 'vendor/iscroll',
            qrcode : 'vendor/qrcode.logo',
            text: 'vendor/require_text',
            nativeApp: 'vendor/nativeApp',
            template: 'vendor/arttemplate',
            sessionStore: 'vendor/sessionStore',
            requestServer: 'vendor/requestServer',
            picLazyLoad: 'vendor/zepto.picLazyLoad.min',
            lottery: 'vendor/lottery'
        },
        shim: {
            zepto: {
                exports: '$'
            },
            text:{
                deps: ['zepto']
            },
            qrcode: {
                deps: ['vendor/jquery-1.8.2', 'vendor/excanvas']
            },
            picLazyLoad: {
                deps: ['zepto']
            },
            lottery: {
                deps: ['zepto']
            }
        },
        modules: arr_modules

    }, function() {
        console.log('rjsBuild done');
    });

};
