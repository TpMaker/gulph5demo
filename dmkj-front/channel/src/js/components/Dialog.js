define(['zepto'],function($) {
	var Me = function(){
		this.html= [];
		this.init(arguments[0],arguments[1]);
	};
	Me.prototype = {
		init: function(content,className){
			var clsName = className||'';
			this.html = $('<div class="__modelMask dialogMask animator '+clsName+'">'+content+'</div>');
			this.html.appendTo(document.body);
			this.open();
		},
		open: function(){
			var self = this;
			setTimeout(function() {
				self.html.addClass('show');
			}, 1);
		},
		close: function(){
			var self = this;
			self.html.removeClass('show');
			self.html.one('webkitTransitionEnd', function(){
				self.html.remove();
			});
		}
	};
	return Me;
});