define(['zepto'],function($) {
	var closeAlert = function(html){
		html.remove();
	};
	return function(content){
		var html = $('<div class="__modelMask __messageBox"><div class="__modelDialog"><div class="remindMessage">'+content+'</div><div class="buttonBox"><a class="confirm">确定</a></div></div></div>');
		html.appendTo(document.body);
		setTimeout(function(){
			html.find('.__modelDialog').addClass('dialogOut');
		},1);
		html.on('click','.confirm',$.proxy(closeAlert,this,html));
	};
});
