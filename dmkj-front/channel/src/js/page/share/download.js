require(['zepto','vendor/native'],function($,native) {
    var me = function(){
        this.init();
    };

    me.prototype.init = function(){
        var iosbtn = $('.iosbtn'),
            andbtn = $('.andbtn'),
            iosurl = 'https://itunes.apple.com/cn/app/dao-meng-kong-jian/id1111507151?mt=8',
            andurl = 'http://5idream.oss-cn-beijing.aliyuncs.com/androidapk/app-release2.0.1.apk';
        var shadow = $('.shadow');
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  //判断iPhone|iPad|iPod|iOS
            iosbtn.css('display','inline-block');
            andbtn.css('display','none');
        }else if (/(Android)/i.test(navigator.userAgent)) {   //判断Android
            iosbtn.css('display','none');
            andbtn.css('display','inline-block');
        }
        iosbtn.on('click',function(){
            if(is_weixin()){
                shadow.css('display','block');
            }else{
                iosbtn.attr('href',iosurl);
            }
        });
        andbtn.on('click',function(){
            if(is_weixin()){
                shadow.css('display','block');
            }else{
                if(confirm("确认现在下载安卓版？")){
                    andbtn.attr('href',andurl);
                }
            }
        });


        function is_weixin(){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;
            } else {
                return false;
            }
        }
    };
    new me();
});

