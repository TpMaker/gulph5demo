require(['zepto','components/Tips'],function($,tips) {
    var Me = function(){
        this.init();
    };

    Me.prototype = {
        init:function(){
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
                            cont = '<div class="space"><p class="psty"><img src="../static/images/space.png"></p><p class="psty">主办方未填写活动详情哦！</p><p class="psty">了解更多，可点击下方【咨询】</p></div>';
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
        }
    };
    new Me();
});
