define(['zepto'],function($) {
	var loading = {
		html: [],
		show: function(text){
			//this.html = $('<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>');
			$('body>.__caseloading').remove();
			this.html = $('<div class="__caseloading"><i class="loadingGif"></i>'+text+'</div>');
			this.html.appendTo(document.body);
			return this.html;
		},
		hide: function(html){
			html.remove();
		},
		addPullDiv: function($node) {
			$('#__pullloading').remove();
			var str = '<div id="__pullloading">拼命加载中...</div>';
			$node.after(str);
		},
		
		setPullContent: function(mess) {
			$('#__pullloading').html(mess);
		},
		
		removePullDiv: function() {
			$('#__pullloading').remove();
		}
	};
	return loading;
});
