require(['zepto','vendor/native','vendor/requestServer','vendor/swiper.min','components/Tips','template'],function($,native,request,Swiper,tips,template) {
    var me = function(){
        this.init();
    };
    me.prototype = {
        init:function(){
            this.bindEvent();
            var mySwiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: 2500,
                autoplayDisableOnInteraction: false
            });
            $.ajax({
                url: '/activity/activity',
                type: 'POST',
                dataType:'json',
                data: {
                    activityid: request.getParameter('activityid')
                },
                success: function (data, status) {
                    if (data.code === '100'){
                        var cont = '',
                            contWrapper = $('.content');
                        if(data.data){
                            cont = data.data.replace(/\d+px/g,function(num){
                                var n = Number(num.replace('px',''));
                                return n===1?'1px':(n*2/75)+'rem';
                            });
                        }else{
                            cont = '<div class="space"><p class="psty"><img src="../static/images/space.png"></p><p class="psty">主办方未填写活动详情哦！</p><p class="psty">了解更多，可点击下方下载到梦空间APP</p></div>';
                        }
                        contWrapper.html(cont);
                    }
                    else{
                        tips(data.msg);
                    }
                },
                error: function(err){
                    tips('请求超时');
                }
            });
            $.ajax({
                url: '/activity/shareSnapshot',
                type: 'POST',
                dataType:'json',
                data: {
                    activityId: request.getParameter('activityid'),
                    type:1
                },
                success: function (data, status) {
                    if (data&&data.rows!=null){
                        $('#listwrap').html(template('listTemp',data));
                        console.log(data);
                    }
                    else{
                        tips(data.msg);
                    }
                },
                error: function(err){
                    tips('请求超时');
                }
            });
        },
        bindEvent:function(){
            $(document.body).on('click','.menu span',function(e){
                $(this).addClass('on').siblings('span').removeClass('on');
                var flag = $(e.currentTarget).attr('data-flag');
                $('.conwrap').hide();
                if(flag==1){
                    $('.part-wrap').show();
                }else if(flag==2){
                    $('.content').show();
                }else if(flag==3){
                    $('.featurelist').show();
                }
            });
        }
    };
    new me();
});
