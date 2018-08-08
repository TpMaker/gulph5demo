require(['zepto','vendor/requestServer','vendor/swiper.min','components/loading','components/Confirm','components/Dialog','components/Tips','nativeApp','template'],function($,request,Swiper,loading,Confirm,Dialog,tips,nativeApp,template) {
    var Me = function(){
        this.pageno = 1;
        this.pagesize = 10;
        this.isLoaded = true;
        this.type = '';
        this.mySwiper = null;
        this.categoryObj = {};
        this.hasMoreData = false;
        this.recordList = [];
        this.selectedRdList = [];
        this.selectedRdIdList = [];
        this.remarkDialog = null;
        this.init();
    };
    var API = {
        list:'qa/getAllQuestionList'
    };
    Me.prototype = {
        init:function(){
            var self = this;
            $('.title-row .icon').on('click',function(e){
                if($('.rows').hasClass('hide')){
                    $(e.currentTarget).removeClass('down').addClass('up');
                    $('.rows').removeClass('hide');
                    $('.rows').show(1000);
                }else{
                    $(e.currentTarget).removeClass('up').addClass('down');
                    $('.rows').addClass('hide');
                    $('.rows').hide(1000);
                }
            });
        }
    };
    new Me();
});

