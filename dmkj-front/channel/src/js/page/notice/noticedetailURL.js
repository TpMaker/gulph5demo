require(['zepto','vendor/requestServer','vendor/previewImage.min','vendor/swiper.min','components/loading','components/Confirm','components/Dialog','components/Tips','nativeApp','template'],function($,request,previewImage,Swiper,loading,Confirm,Dialog,tips,nativeApp,template) {
    var Me = function(){
        this.urls = [];
        this.init();
    };
    
    Me.prototype = {
        init:function(){
            var self = this;
            self.preview();
            nativeApp.callNative('Web.hideBar', {'hide':'y'}, {});
            var url = request.getParameter('url');
            $('.iframeWrapper').html(template('detailTemp',{url:url}));
            self.backUrl();
        },
        backUrl:function(){
            var self = this;
            var type = request.getParameter('type');
            if(type==1){
                $('.back').on('click',function(){
                    location.href = '/yuny/userNoticeList.html';
                });
            }else{
                $('.back').on('click',function(){
                    nativeApp.callNative("Web.close", {},{});
                });
            }
        },
        pushHistory:function () { 
            var state = { 
                title: "title", 
                url: "#"
            }; 
            window.history.pushState(state, "title", "#"); 
        },
        all:function(selector, contextElement) {
            var nodeList,
                list = [];
            if (contextElement) {
                nodeList = contextElement.querySelectorAll(selector);
            } else {
                nodeList = document.querySelectorAll(selector);
            }
            if (nodeList && nodeList.length > 0) {
                list = Array.prototype.slice.call(nodeList);
            }
            return list;
        },
        delegate:function($el, eventType, selector, fn) {
            var self = this;
          if (!$el) { return; }
          $el.addEventListener(eventType, function(e) {
            var targets = self.all(selector, $el);
            if (!targets) {
              return;
            }
            // findTarget:
            for (var i=0; i<targets.length; i++) {
              var $node = e.target;
              while ($node) {
                if ($node == targets[i]) {
                  fn.call($node, e);
                  break; //findTarget;
                }
                $node = $node.parentNode;
                if ($node == $el) {
                  break;
                }
              }
            }
          }, false);
        },
        preview:function(){
            var self = this;
            self.imgs = self.all('img',self.all('#imgBox')[0]);
            self.imgs.forEach(function(v,i){
                self.urls.push(v.src);
            });
            self.delegate(document.querySelector('#imgBox'), 'click','img',function(){
                var current = this.src;
                var obj = {
                    urls : self.urls,
                    current : current
                };
                previewImage.start(obj);
            });
        }
    };
    new Me();
});
