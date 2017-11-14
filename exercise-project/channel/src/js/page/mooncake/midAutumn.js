require(['zepto','components/Goldcoin'],function($,Goldcoin){
	var Me = function(){
		this.init();
	};

	Me.prototype = {
		init:function(){
            new Goldcoin();
            this.showMooncake();
            this.bindEvent();
        },
        bindEvent: function(){
            $('.bgm-btn').on('click', $.proxy(this.playMusic, this));
            $('.zhaohuan, .directionMask').on('click', $.proxy(this.openDirectMask, this));
        },
        playMusic: function(e){
            var target = $('.bgm-btn');
            var music = document.getElementById('myaudio');
            if (music.paused){
                music.play();
                target.addClass('rotate');
            } 
            else{
                music.pause();
                target.removeClass('rotate');
            } 
        },
        openDirectMask: function(){
            $('.directionMask').toggleClass('hidden');
            localStorage.setItem('isShared',1);
        },
        showMooncake: function(){
            var isShared = localStorage.getItem('isShared');
            if (isShared === '1'){
                $('.fetchPacket').removeClass('disabled');
            }
        }
    };
	new Me();
});
