require(['zepto','vendor/requestServer','vendor/previewImage.min','components/loading','components/Confirm','components/Dialog','components/Tips','nativeApp','vendor/qrcode.min','template'],function($,request,Swiper,loading,Confirm,Dialog,tips,nativeApp,qrcode,template) {
    var Me = function(){
        this.urls = [];
        this.init();
        this.pushHistory();
    };
    
    Me.prototype = {
        init:function(){
            var self = this;
            // self.preview();
            self.qrcodeinit();
            nativeApp.callNative('Web.hideBar', {'hide':'y'}, {});
            window.addEventListener("popstate", function(e) { 
                location.href = '/printer/printerlist.html';
            }, false);
            $('.back').on('click',function(){
                location.href = '/printer/printerlist.html';
            });
        },
        qrcodeinit:function(){
            var self = this;
            var url = $('#qrcodewrap').attr('data-url');
            self.initqrcode('qrcodewrap',url,220,220);
        },
        pushHistory:function () { 
            var state = { 
                title: "title", 
                url: "#"
            }; 
            window.history.pushState(state, "title", "#"); 
        },
        initqrcode:function(id,data,width,height){
            var qrcode = new QRCode(document.getElementById(id), {
                render:'canvas',
                width : width,      
                height : height
            });
            qrcode.makeCode(data);
            // $(id).html('');
            // $(id).QRCode({
            //     render: 'canvas', //也可以替换为table
            //     width: width,
            //     height: height,
            //     text: data
            // });
        },
    };
    new Me();
});
