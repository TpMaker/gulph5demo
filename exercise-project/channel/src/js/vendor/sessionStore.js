define(['zepto'],function($) {
	return {
		getToken:function(){
			return sessionStorage.getItem("token");
		},
		setToken:function(token){
			return sessionStorage.setItem("token",token);
		},
        getitemType:function(){
            return sessionStorage.getItem("itemType");
        },
        setitemType:function(itemType){
            return sessionStorage.setItem("itemType",itemType);
        },
        getUserid: function(){
			return sessionStorage.getItem("userid");
		},
		setUserid: function(userid){
			sessionStorage.setItem("userid",userid);
		}
	}
});
