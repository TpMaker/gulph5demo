define(['zepto'],function($) {
	var closeAlert = function(html){
		html.remove();
	};
	return function(content){
		var html = $('<div class="__modelMask __messageBox animator show">'
			+'<div class="__modelDialog">'
			+'<div class="remindMessage">'+content+'<a href="#" class="iconfont icon-close btn_close"></a></div>'
			+'<button class="ok">确定</button></div></div>');
		html.appendTo(document.body);
		html.on('click','.btn_close,.ok',$.proxy(closeAlert,this,html));
	};
});
