define(['zepto','nativeApp'],function($,nativeApp) {
    var me = function(){
        this.init();
    };
    
    me.prototype = {
        init:function(){
            this.windowTouchmove();
            $(window).on('touchmove MSPointerMove pointermove scroll',$.proxy(this.windowTouchmove,this));
            $('.navigateBar .whiteBack').on('click',$.proxy(this.goback,this));
        },
        windowTouchmove:function(){
            var clientHeight = document.documentElement.clientHeight;
            var biggetScrollTop = clientHeight*0.1;
            var totalScrollTop = clientHeight*0.2;
            var scrollTop = document.body.scrollTop;
            var opacity = 0;
            if (document.body.scrollHeight-clientHeight>totalScrollTop){
                if (scrollTop>=totalScrollTop){
                    $('.navigateBar .navigTitle').removeClass('hidden');
                    $('.navigateBar').addClass('normal').css('opacity',1);
                }
                else if (scrollTop<totalScrollTop&&scrollTop>biggetScrollTop){
                    opacity = (scrollTop-biggetScrollTop)/(totalScrollTop-biggetScrollTop);
                    opacity = Math.max(opacity,0.1);
                    $('.navigateBar .navigTitle').removeClass('hidden');
                    $('.navigateBar').addClass('normal').css('opacity',opacity);
                }
                else if (scrollTop<=biggetScrollTop){
                    opacity = (1/biggetScrollTop)*(biggetScrollTop-scrollTop);
                    opacity = Math.max(opacity,0.1);
                    $('.navigateBar .navigTitle').addClass('hidden');
                    $('.navigateBar').removeClass('normal').css('opacity',opacity);
                }
            }
            
        },
        goback: function(){
            nativeApp.callNative('Web.back', {}, {});
        }
    };
    new me();
});
