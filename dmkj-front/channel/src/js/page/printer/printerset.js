require(['zepto','vendor/requestServer','vendor/swiper.min','components/loading','components/Confirm','components/Dialog','components/Tips','nativeApp','template'],function($,request,Swiper,loading,Confirm,Dialog,tips,nativeApp,template) {
    var Me = function(){
        this.init();
        this.pushHistory();
    };
    
    Me.prototype = {
        init:function(){
            var self = this;
            this.flag=0;
            self.initnum();
            $(document.body).on('click','.add',$.proxy(this.addnum,this));
            $(document.body).on('click','.sub',$.proxy(this.subnum,this));
            $(document.body).on('click','.button',$.proxy(this.submit,this));
            nativeApp.callNative('Web.hideBar', {'hide':'y'}, {});
            window.addEventListener('popstate', function(e) { 
                nativeApp.callNative('Web.close', {},{});
            }, false);
            $('.back').on('click',function(){
                nativeApp.callNative('Web.close', {},{});
            });
        },
        pushHistory:function () { 
            var state = { 
                title: 'title', 
                url: '#'
            }; 
            window.history.pushState(state, 'title', '#'); 
        },
        initnum:function(){
            var self = this;
            var used = $('#used').val();
            var alluse = $('#alluse').val();
            self.num = alluse - used;
        },
        submit:function(){
            var self = this;
            if(self.flag==1){
                return;
            }
            self.flag=1;
            var printnum = parseInt($('#numinp').html());
            var qualityid = $('#printid').val();
            $.ajax({
                url:'/printer/printer/addPrinterLog',
                data:{'qualityid':qualityid,'printnum':printnum},
                type:'post',
                success:function(data){
                    tips('保存成功');
                    setTimeout(function(){
                        self.flag=0;
                        window.location.href='/printer/printerlist.html';
                    },2000);
                },
                error:function(err){
                    tips('网络错误');
                    self.flag=0;
                }
            });
        },
        addnum:function(){
            var self = this;
            var num = parseInt($('#numinp').html());
            if(self.num<=0){
                return;
            }
            if(num>=self.num){
                tips('最多打印'+self.num+'份');
                return;
            }
            $('#numinp').html(num+1);
        },
        subnum:function(){
            var self = this;
            var num = parseInt($('#numinp').html());
            if(self.num<=0){
                return;
            }
            if(num<=1){
                tips('至少一份');
                return;
            }
            $('#numinp').html(num-1);
        },
    };
    new Me();
});
