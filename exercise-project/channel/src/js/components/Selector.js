define(['zepto','template','text!./templates/selector.htm'],function($,template,selectorTemp){
	var me = function(){
		this.selector = arguments[0];
		this.value = arguments[1];
		this.optionList = arguments[2];
		this.selectorBox = null;
		this.startPosY = 0;
		this.bindEvent();
	};

	me.prototype.bindEvent = function(){
		var currentVal = this.getCurrentVal(this.value);
		this.selector.attr('data-value',self.value).text(currentVal.name);
		this.selector.on('click',$.proxy(this.openSelector,this));
	};

	me.prototype.openSelector = function(e){
		var obj = {optionList:this.optionList};
		var render = template.compile(selectorTemp);
		var html = $(render(obj));
		html.appendTo(document.body);
		this.selectorBox = html;
		this.selectorBox.on('touchstart','.selectorContent',$.proxy(this.selectorTouchStart,this));
		this.selectorBox.on('touchmove','.selectorContent',$.proxy(this.selectorTouchMove,this));
		this.selectorBox.on('touchend','.selectorContent',$.proxy(this.selectorTouchEnd,this));
		this.selectorBox.on('click','.finish',$.proxy(this.selectorFinish,this));
		this.selectorBox.find('.selectorMask').on('click',$.proxy(this.closeSelector,this));
		this.changeCheckedText();
		setTimeout($.proxy(function(){
			this.selectorBox.find('.selectorMask').removeClass('hidden');
			this.selectorBox.find('.selectorBox').addClass('show');
		},this),1);
	};
	
	me.prototype.getCurrentVal = function(val){
		var currentVal = {};
		var optionList = this.optionList;
		if (optionList&&optionList.length>0){
			for(var i=0;i<optionList.length;i++){
				if (optionList[i].id==val){
					currentVal = optionList[i];
					break;
				}
			}
		}
		return currentVal;
	};

	me.prototype.selectorTouchStart = function(e){
		e.preventDefault();
		var curTarget = $(e.currentTarget);
		this._lineHeight = curTarget.height()/curTarget.children().length;
		this.startPosY = e.touches[0].clientY;
		e.stopPropagation();
	};

	me.prototype.selectorTouchMove = function(e){
		e.preventDefault();
		var self = this,address = '';
		var curTarget = $(e.currentTarget);
		var cellLength = curTarget.find('li').length;
		var currentTop = curTarget.position().top;
		var endPosY = e.touches[0].clientY;
		var splitPosY = endPosY-self.startPosY;
		var totalLen = -self._lineHeight*(cellLength-1);
		var posTop = currentTop+splitPosY;
		posTop = posTop>0?0:posTop;
		posTop = posTop<totalLen?totalLen:posTop;
		self.startPosY = endPosY;
		curTarget.css({'top':posTop+'px'});
		this.getCheckedLine();
		e.stopPropagation();
	};

	me.prototype.selectorTouchEnd = function(e){
		e.preventDefault();
		var self = this;
		var curTarget = $(e.currentTarget);
		var currentIndex = curTarget.find('.checkedText').index();
		var currentTop = curTarget.position().top;
		if(currentTop%self._lineHeight!==0){
			var newTop = -currentIndex*self._lineHeight;
			curTarget.css({'top':newTop+'px'});
		}
		e.stopPropagation();
	};

	me.prototype.getCheckedLine = function(){
		var self = this;
		var selectorTop = this.selectorBox.find('.currentCell').offset().top;
		var selectorList = this.selectorBox.find('.selectorContent>li');
		if (selectorList&&selectorList.length>0){
			for (var n = 0; n < selectorList.length; n++) {
				var item = selectorList[n];
				$(item).attr('class','');
				var currentCellTop = $(item).offset().top;
				var lineHeight = Math.ceil(self._lineHeight/2);
				if (Math.abs(selectorTop-currentCellTop)<=lineHeight){
					for (var j = 1;j<=4;j++){
						if (selectorList.eq(n+j).is('li')&&n+j>-1){
							selectorList.eq(n+j).attr('class','c'+j);
						}
						if (selectorList.eq(n-j).is('li')&&n-j>-1){
							selectorList.eq(n-j).attr('class','c'+j);
						}
					}
					$(item).attr('class','checkedText');
					break;
				}
			}
		}
	};

	me.prototype.changeCheckedText = function(){
		var val = this.value;
		var selectorContent = this.selectorBox.find('.selectorContent');
		var selectorList = selectorContent.find('li');
		var checkedLine = selectorList.filter('li[data-value="'+val+'"]');
		var n = checkedLine.index();
		this._lineHeight = selectorContent.height()/selectorList.length;
		var top = -(n * this._lineHeight);
		checkedLine.addClass('checkedText');
		this.selectorBox.find('.selectorContent').css('top',top+'px');
		for (var j = 1;j<=4;j++){
			if (selectorList.eq(n+j).is('li')&&n+j>-1){
				selectorList.eq(n+j).attr('class','c'+j);
			}
			if (selectorList.eq(n-j).is('li')&&n-j>-1){
				selectorList.eq(n-j).attr('class','c'+j);
			}
		}
	};

	me.prototype.selectorFinish = function(){
		var id = this.selectorBox.find('.checkedText').attr('data-value');
		var name = this.selectorBox.find('.checkedText').text();
		this.setValue(id,name);
		this.closeSelector();
	};

	me.prototype.closeSelector = function(){
		this.selectorBox.find('.selectorBox').removeClass('show');
		setTimeout($.proxy(function(){
			this.selectorBox.remove();
		},this),400);
	};

	me.prototype.setValue = function(id,name){
		this.value = id;
		this.selector.attr('data-value',id).text(name);
	};

	me.prototype.getValue = function(id,name){
		return this.selector.attr('data-value');
	};

	me.prototype.getText = function(id,name){
		return this.selector.text();
	};
	return me;
});