define(['zepto','vendor/requestServer','components/Tips'],function($,request,tips){
    return {
		addWxjsFile: function(){
			var jsUrl = 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js';
			var hm = document.createElement("script");
			if (location.protocol==='http:'){
				jsUrl = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js';
			}
			hm.src = jsUrl;
			var s = document.getElementsByTagName("script")[0];
			if (!s){
				s = document.getElementsByTagName("head")[0].lastChild;
			}
			s.parentNode.insertBefore(hm, s);
		},
        setContent: function(title,desc,link,imgUrl){
            var url = encodeURIComponent(encodeURIComponent(location.href.split('#')[0]));
			request.ajax("/wechat/jsapiSignature?url=" + url,{},function(data){
				var result = data.result;
                if (data.success&&result&&result.appId){
					var appId = result.appId;
					var timestamp = result.timestamp;
					var nonceStr = result.nonceStr;
					var signature = result.signature;
					wx.config({
						debug: false,
						appId: appId,
						timestamp: timestamp,
						nonceStr: nonceStr,
						signature: signature,
						jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems', 'showMenuItems']
					});
					wx.ready(function(){
						wx.onMenuShareAppMessage({
							title: title,
							desc: desc,
							link: link,
							imgUrl: imgUrl,
							success: function () {
								console.log('share success...');
							}
						});
						wx.onMenuShareTimeline({
							title: title,
							link: link,
							imgUrl: imgUrl,
							success: function () {
								console.log('share success...');
							}
						});
						wx.showMenuItems({
							menuList: ['menuItem:share:timeline', 'menuItem:share:appMessage']
						});
						wx.hideMenuItems({
							menuList: ['menuItem:share:qq', 'menuItem:openWithQQBrowser', 'menuItem:openWithSafari',
								'menuItem:share:email', 'menuItem:copyUrl', 'menuItem:favorite', 'menuItem:readMode']
						});
						
					});
				} 
			},function(err){
                tips('请求超时');
            });
        },
        hideShareMenu: function(){
            var url = encodeURIComponent(encodeURIComponent(location.href.split('#')[0]));
			request.ajax("/wechat/jsapiSignature?url=" + url,{},function(data){
                var result = data.result;
                if (data.success&&result&&result.appId){
					var appId = result.appId;
					var timestamp = result.timestamp;
					var nonceStr = result.nonceStr;
					var signature = result.signature;
					wx.config({
						debug: false,
						appId: appId,
						timestamp: timestamp,
						nonceStr: nonceStr,
						signature: signature,
						jsApiList: ['hideAllNonBaseMenuItem']
					});
                    wx.ready(function(){
                        wx.hideAllNonBaseMenuItem();
                    });					
                }
            });

        }
    }
});
    