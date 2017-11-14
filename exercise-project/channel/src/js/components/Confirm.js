define(['zepto'],function($) {
	var closeConfirm = function(html){
		html.remove();
	}
	var confirmDialog = function(html,confirmFunc){
		html.remove();
		confirmFunc();
	}
	return function(content,confirmFunc){
		var html = $('<div class="__modelMask __messageBox animator show">'
			+'<div class="__modelDialog">'
			+'<div class="remindMessage">'+content+'<a href="#" class="iconfont icon-close btn_close"></a></div>'
			+'<div class="buttonBox"><button class="ok">确定</button>'
			+'<button class="cancel">取消</button></div></div></div>');
		html.appendTo(document.body);
		html.find(".ok").on("click",$.proxy(confirmDialog,this,html,confirmFunc));
		html.find(".btn_close,.cancel").on("click",$.proxy(closeConfirm,this,html));
	};
});