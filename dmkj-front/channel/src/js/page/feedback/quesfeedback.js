require(['zepto','vendor/requestServer','vendor/swiper.min','components/loading','components/Confirm','components/Dialog','components/Tips','nativeApp','template'],function($,request,Swiper,loading,Confirm,Dialog,tips,nativeApp,template) {
    var Me = function(){
        this.init();
        this.flag = 0;
    };
    var imgnum = 0;
    var appver = '';
    var phonedevice = '';
    var sys = '';
    var sysver = '';
    Me.prototype = {
        init:function(){
            var self = this;
            $('.btns .btn').on('click',$.proxy(this.styleChange,this));
            $('.form-box .radio').on('click',$.proxy(this.radioChange,this));
            $('.submitButton').on('click',$.proxy(this.formSubmit,this));
            // $('#quesdetail').on('input propertychange',$.proxy(this.wordNum,this));
            $(document.body).on('click','.delImg',$.proxy(this.delImg,this));
            nativeApp.callNative('Web.hideBar', {'hide':'y'}, {});
            $('.upload-btn').on('click',function(e){
                if(glob_imgnum<9){
                    nativeApp.callNative('Tool.uploadSingleImage',{},uploadImg);
                    // self.uploadImg({"code":100,"data":{"imageUrl":"http://jingcai-test.oss-cn-shanghai.aliyuncs.com/1169814/1512375550"}})
                }else{
                    tips('最多上传9张图片');
                    return;
                }
            });
            self.wordNum();
            nativeApp.callNative('Device.info',{},phoneInfo);
        },
        delImg:function(e){
            glob_imgnum = glob_imgnum-1;
            $(e.currentTarget).parent('.delImgwrapper').remove();
        },
        wordNum:function(){
            var self = this;
            var text = document.getElementById('quesdetail');
            var txtNum = document.getElementById('wordnum');
            self.chnIpt = false;

            text.addEventListener('keyup',function(){
                if(self.chnIpt ==false){
                    self.countTxt();
                }
            });
            text.addEventListener('compositionstart',function(){
                self.chnIpt = true;
            });
            text.addEventListener('compositionend',function(){
                self.chnIpt = false;
                self.countTxt();
            });
        },
        countTxt:function(){
            var self = this;
            var text = document.getElementById('quesdetail');
            var txtNum = document.getElementById('wordnum');
            if(self.chnIpt == false){
                txtNum.textContent = text.value.length;
            }
        },
        styleChange:function (e) {
            if($(e.currentTarget).hasClass('active')){
                return;
            }else{
                $('.btns .btn').removeClass('active');
                $(e.currentTarget).addClass('active');
            }
        },
        radioChange:function(e){
            $('.form-box .radio').removeClass('active');
            $(e.currentTarget).addClass('active');
        },
        formSubmit:function(e){
            var self = this;
            if(this.flag!=0){
                return;
            }
            var suggesttype = $('.btns .active').attr('data-id');
            var content = $('#quesdetail').val();
            var suggestpoint = $('.form-box .active').attr('data-id');
            var qq = $('#qq').val();
            var reg=/^\d{0,12}$/; 
            if(!reg.test(qq)){
                tips('请输入正确的qq号');
                return;
            }
            var imgarr = [];
            $('.img-cnt .imgitem').each(function(index,item){
                imgarr.push($(item).attr('src'));
            });
            var phone = $('#phoneInfo').val();
            var appver = $('#appver').val();
            var param = {'appversion':appver,'phoneagent':phone,'picList':imgarr,'suggesttype':suggesttype,'content':content,'suggestpoint':suggestpoint,'qq':qq};
            if(self.validForm(content)){  
                this.flag++;
                $.ajax({
                    url:'/feedback/feedback/submitFeedback',
                    type:'post',
                    contentType:'application/json',
                    data:JSON.stringify(param),
                    success:function(data){
                        if(data.code==100){
                            tips('提交成功');
                            setTimeout(function(){
                                location.href='/feedback/myfeedback.html';
                            },2000);
                        }else{
                            tips(data.msg);
                        }
                    },
                    error:function(){
                        tips('服务器未响应');
                        self.flag=0;
                    }
                });
            }
        },
        validForm:function (content) {
            var telReg = /^1[0-9]{10}$/;
            if(!$.trim(content)){
                tips('请输入问题内容');
                return false;
            }
            return true;
        }
    };
    new Me();
});
var glob_imgnum = 0;
function phoneInfo(data){
    $('#phoneInfo').val(data.data.device+' '+data.data.system+' '+data.data.sysVersion);
    $('#appver').val(data.data.version);
}
function uploadImg(data){
    if(data.code==100){
        glob_imgnum = glob_imgnum+1;
        $('.imgnum').html(glob_imgnum);
        var url = data.data.imageUrl;
        $('.upload-btn').before('<span class="delImgwrapper"><i class="delImg"></i><img class="imgitem" src="'+url+'"></span>');
    }
}
