define(['zepto'],function($) {
    return function(content, type, time){
        var icon='';
        var delayTime = time?time:1800;
        if(type === 'error'){
            icon = '<span class="'+type+'">&#xe601;</span>';
        }
        else if(type === 'success'){
            icon = '<span class="'+type+'">&#xe644;</span>';
        }
        
        var html = $('<div class="__tipModelBox">'+icon+''+content+'</div>');
        html.appendTo(document.body);
        setTimeout(function(){
            html.addClass('bounceOut')
            setTimeout(function(){
                html.remove();
            },5000);
        },1);
        
    };
});

