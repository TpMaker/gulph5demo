define([],function() {
    var agent = navigator.userAgent.toLowerCase();
    //将版本字符转化成浮点型
    var parseVersion = function(label){
        var exp = new RegExp(label+'/([^\\s\\_\\-]+)');
        label = (agent.match(exp)||[])[1];
        return label ? label.replace(/(?!^\d+\.)(\b\d+)./g, '$1') : false
    };
    
    var result = {
        //获取当前操作系统
        os: function(){
            if(/windows/.test(agent)){
                return 'windows';
            } else if(/linux/.test(agent)){
                return 'linux';
            } else if(/|iphone|ipod|ipad|ios/.test(agent)){
                return 'ios';
            }
        }()
        //获取微信版本，不在微信WebWiew则返回falase
        ,weixin: parseVersion('micromessenger')
        //获取你的App版本，不在App WebWiew则返回falase。记得把myapp改成你的app特殊标识
        ,myapp: parseVersion('myapp')
    };
    result.android = /android/.test(agent); //是否安卓
    result.ios = result.os === 'ios'; //是否IOS
    return result;
});
