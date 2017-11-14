define(['zepto'],function($) {
	return {
		ajax : function(url,param,callback,errorCallback){
			$.ajax({
				type: "post",
				url: url,
				data: param,
				dataType: 'json',
				success: callback,
				error: errorCallback
			});
		},
		ajaxGet : function(url,param,callback,errorCallback){
			$.ajax({
				type: "get",
				url: url,
				data: param,
				dataType: 'json',
				jsonp: 'callback',
				success: callback,
				error: errorCallback
			});
		},
		ajaxJsonp : function(url,param,callback,errorCallback){
			$.ajax({
				type: "get",
				url: url,
				data: param,
				dataType: 'jsonp',
				success: callback,
				error: errorCallback
			});
		},
		getParameter:function(name){
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null)return  unescape(r[2]); return null;
		}
	}
});