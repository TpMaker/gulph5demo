define(['zepto','nativeApp'],function($,nativeApp) {
    var me = function(){
        this.init();
    }
    
    me.prototype = {
        init:function(){
            nativeApp.callNative("Web.hideClose", {"hide":"y"}, {});
            $('.webHeadTitle .iconBack').on('click',$.proxy(this.goback,this));
        },
        goback: function(){
            nativeApp.callNative("Web.back", {}, {});
        }
    }
    new me();
});
