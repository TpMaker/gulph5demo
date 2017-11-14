define(['zepto'],function($) {
    var me = function(){
		this.target = arguments[0];
		this.value = arguments[1];
		this.optionList = arguments[2];
        this.scrolled = true;
        this.startPosY = 0;
        this.init();
    };
    
    me.prototype = {
        init:function(){
			var self = this;
			var currentVal = this.optionList.find(function(v){return v.id===self.value;});
			this.target.attr('data-value',self.value).text(currentVal.name);
			self.renderContent();
			self.target.on('click',$.proxy(this.oepnMaskDialog,this));
			$(document.body).on('touchmove',function(){return self.scrolled;});
            $('._selectorComponent .cancelSelector, ._selectorComponent ._loadingMask').on('click',$.proxy(this.closeMaskDialog,this));
            $('._selectorComponent .selectorList').on('touchstart',$.proxy(this.selectorTouchstart,this));
			$('._selectorComponent .selectorList').on('touchmove',$.proxy(this.selectorTouchmove,this));
			$('._selectorComponent .selectorList>li').on('click',$.proxy(this.clickCurrentItem,this));
		},
		renderContent:function(){
			var self = this;
			var rows = $.map(self.optionList,function(v,i){
				var selected = v.id === self.value?'selected':'';
				return '<li data-value="'+v.id+'" class="'+selected+'">'+v.name+'</li>';
			}).join("");
            var content = '<div class="_selectorComponent">'+
				'<div class="_loadingMask hidden"></div>'+
				'<div class="selectorDialog">'+
					'<div class="selectorListBox">'+
						'<ul class="selectorList" style="top:0px;">'+rows+'</ul>'+
					'</div>'+
					'<div class="cancelSelector">取消</div>'+
				'</div>'+
			'</div>';
			$(document.body).append(content);
			return content;
        },
        oepnMaskDialog:function(){
            this.scrolled = false;
            $('._loadingMask').removeClass('hidden');
            $('.selectorDialog').addClass('show');
        },
        closeMaskDialog:function(){
            this.scrolled = true;
            $('.selectorDialog').removeClass('show');
            setTimeout(function() {
                $('._loadingMask').addClass('hidden');
            }, 500);
		},
		clickCurrentItem:function(e){
			var target = $(e.currentTarget);
			target.addClass('selected');
			target.siblings().removeClass('selected');
			this.target.text(target.text());
			this.target.attr("data-value",target.attr("data-value"));
			this.closeMaskDialog();
        },
        selectorTouchstart:function(e){
            this.startPosY = e.touches[0].clientY;
        },
        selectorTouchmove:function(e){
			e.preventDefault();
            var target = $(e.currentTarget);
            var endPosY = e.touches[0].clientY;
            var splitPosY = endPosY-this.startPosY;
            var originTop = Number(target.css('top').replace('px',''));
            var posTop = originTop+splitPosY;
            var maxScrolled = $('.selectorListBox').height()-$('.selectorList').height();
            posTop = Math.min(Math.max(posTop,maxScrolled),0);
            this.startPosY = endPosY;
            target.css({'top':posTop});
        }
    };
    return me;
});
