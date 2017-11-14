
require.config({
    //baseUrl: ' http://192.168.0.33/channel-h5/aicai-front/channel/static/js/', //联调
    baseUrl: aixuedai.staticpath + '/js/', //联调
    urlArgs: 'version=' + '20161205182088',
    map: {
        '*': {
            'css': 'vendor/css_min'
        }
    },
    paths: {
        zepto: 'vendor/zepto',
        swiper: 'vendor/swiper.min',
        iscroll: 'vendor/iscroll',
        qrcode : 'vendor/qrcode.logo',
        text: 'vendor/require_text',
        nativeApp: 'vendor/nativeApp',
        cssLoad: '../css',
        template: 'vendor/arttemplate',
        sessionStore: 'vendor/sessionStore',
        requestServer: 'vendor/requestServer',
        picLazyLoad: 'vendor/zepto.picLazyLoad.min',
        lottery: 'vendor/lottery'
    },
    shim: {
        'zepto': {
            exports: '$',
            deps: ['css','text','template']
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
    }
});
