define(['zepto'],function($) {
	var closeConfirm = function(html){
		html.remove();
	};
	var confirmDialog = function(html,confirmFunc){
		html.remove();
		confirmFunc();
	};
	return function(content,confirmFunc){
		var html = $('<div class="__modelMask __messageBox"><div class="__modelDialog"><div class="remindMessage">'+content+'</div><div class="buttonBox"><a class="ok">确定</a><a class="cancel">取消</a></div></div></div>');
		html.appendTo(document.body);
		setTimeout(function(){
			html.find('.__modelDialog').addClass('dialogOut');
		},1);
		html.find('.ok').on('click',$.proxy(confirmDialog,this,html,confirmFunc));
		html.find('.btn_close,.cancel').on('click',$.proxy(closeConfirm,this,html));
	};
});