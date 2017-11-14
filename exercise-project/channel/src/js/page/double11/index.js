require(['zepto'],function($){
	var Me = function(){
		this.init();
	};

	Me.prototype = {
		init:function(){
            this.bindEvent();
        },
        bindEvent: function(){
            $('.fetchdog').on('click', $.proxy(this.fetchDog, this));
		},
		fetchDog: function(){
			$('.chestBox .hook').addClass('fetch2');
			$('.chestBox .hook').one('webkitAnimationEnd', function(){
				$('.chestBox .hook').removeClass('fetch2');
			});
		}
    };
	new Me();
});
