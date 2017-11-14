define(['zepto'],function($) {
	return {
		initDialog:function(content,className){
			$(content).removeClass("hidden");
			var renderHtml = content.outerHTML;
			var clsName = className?className:'';
			var html = $('<div class="__modelMask animator '+clsName+'">'
				+'<div class="__modelDialog"><a href="#" class="iconfont icon-close btn_close"></a>'
				+renderHtml+'</div></div>');
			$(content).replaceWith(html);
			html.on("click",".btn_close",$.proxy(this.close,this,html));
			html.on("click",$.proxy(this.closeDialogs,this,html));
			return html;
		},
		open:function(html){
			html.addClass("show");
			return false;
		},
		close:function(html){
			html.removeClass("show");
			return false;
		},
		closeDialogs:function(html){
			if ($(event.target).hasClass('animator')){
				html.removeClass("show");
			}
			return false;
		}
	}
});