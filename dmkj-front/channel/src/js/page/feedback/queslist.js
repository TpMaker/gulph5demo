require(['zepto','vendor/requestServer','vendor/swiper.min','components/loading','components/Confirm','components/Dialog','components/Tips','nativeApp','template'],function($,request,Swiper,loading,Confirm,Dialog,tips,nativeApp,template) {
    var Me = function(){
        this.pageno = 1;
        this.pagesize = 10;
        this.isLoaded = true;
        this.type = '';
        this.mySwiper = null;
        this.categoryObj = {};
        this.hasMoreData = false;
        this.recordList = [];
        this.selectedRdList = [];
        this.selectedRdIdList = [];
        this.remarkDialog = null;
        this.pushHistory();
        this.init();
    };
    var API = {
        list:'qa/getAllQuestionList'
    };
    Me.prototype = {
        init:function(){
            var self = this;
            sessionStorage.clear();
            self.getCurrentData();
            self.getCategoryList();
            nativeApp.callNative('Web.hideBar', {'hide':'y'}, {});
            $(window).on('scroll',$.proxy(this.windowScroll,this));
            $("#searchInp").on('keyup',$.proxy(this.keysearch,this));
            $('.queslistpage .navlist>li').on('click', $.proxy(this.chooseCategory,this));
            $('.cancelinput').on('click',function(){
                $('#searchInp').val('');
                self.getCurrentData();
            });
            $(document.body).on('click','.quesitem',$.proxy(this.jumpUrl,this));
            $('.back').on('click',function(){
                nativeApp.callNative("Web.close", {},{});
            });
            window.addEventListener("popstate", function(e) { 
                nativeApp.callNative("Web.close", {},{});
            }, false);
        },
        pushHistory:function () { 
            var state = { 
                title: "title", 
                url: "#"
            }; 
            window.history.pushState(state, "title", "#"); 
        },
        jumpUrl:function(e){
            var self = this;
            var url = $(e.currentTarget).attr('data-url');
            location.href = url;
        },
        keysearch:function(e) {
            var self = this;
            var keycode = e.keyCode;
            self.pageno =1;
            // var searchName = $(this).val();  
            if(keycode=='13') {  
                // e.preventDefault();  
                //请求搜索接口
                document.getElementById('searchInp').blur();
                var loadingBox = loading.show('加载中...');
                var param = {type: self.type, page:self.pageno, pagesize:self.pagesize,question:$('#searchInp').val()};
                request.ajax(API.list, param, function(data){
                    // sessionStorage.setItem(dataKey, JSON.stringify(data.rows));
                    self.renderRecordContent(data.rows);
                    loading.hide(loadingBox);
                }, function(err){
                    self.isLoaded = true;
                    loading.hide(loadingBox);
                    tips('请求超时');
                });
                  
            }  
         },
        getCategoryList: function(){
            var categoryList = {};
            $('.growRecordPage .categoryList>li').each(function(i,item){
                var id = $.trim($(item).attr('data-value'));
                var name = $.trim($(item).text());
                if (id&&name){
                    categoryList[id] = name;
                }
            });
            this.categoryList = categoryList;
        },
        selectedRecord: function(e){
            var self = this;
            var target = $(e.currentTarget);
            var id = target.attr('data-id');
            if (!$('.recordsPageList').hasClass('forbidEdited')){
                target.toggleClass('selected');
                var index = self.selectedRdIdList.indexOf(id);
                if (index===-1&&target.hasClass('selected')){
                    self.selectedRdIdList.push(id);
                }
                else if(!target.hasClass('selected')){
                    self.selectedRdIdList.splice(index,1);
                }
                $('.growRecordPage .J_confirm .num').text(self.selectedRdIdList.length);
            }
        },
        concatRecordList: function(pushedArr){
            var self = this, recordList = this.recordList;
            if (pushedArr&&pushedArr.length>0){
                $.each(pushedArr,function(index,value){
                    var record = self.getCurrentRecord(value.id);
                    if (!record){
                        recordList.push(value);
                    }
                });
            }
            return recordList;
        },
        setRecordsList: function(rowList){
            var rows = [];
            if (rowList&&rowList.length>0){
                rows = $.extend(rowList,true);
                var selectedRdIdList = this.selectedRdIdList;
                $.each(rows,function(idx,value){
                    var index = selectedRdIdList.indexOf(value.id);
                    if (index>-1){
                        value.selected=true;
                    }
                });
            }
            return rows;
        },
        renderRecordContent: function(rowList){
            var self = this, html = '';
            var rows = self.setRecordsList(rowList);
            self.hasMoreData = rows&&rows.length===self.pagesize;
            if (self.pageno===1){
                html = template('quesListTemp', {rows:rows,pageno:self.pageno});
                $('.queslist-wrapper .list-item').html(html);
            }
            else{
                html = template('quesListTemp', {rows:rows,pageno:self.pageno});
                $('.queslist-wrapper .list-item').append(html);
            }
            if (self.hasMoreData){
                $('.loadingMessage').addClass('hidden');
            }
            else{
                $('.loadingMessage').removeClass('hidden');
            }
            self.isLoaded = true;
        },
        getCurrentData: function(){
            var self = this;
            var dataKey = 'record_'+self.type+'_'+self.pageno;
            $('html,body').scrollTop(0);
            if (sessionStorage.getItem(dataKey)){
                var rows = JSON.parse(sessionStorage.getItem(dataKey));
                self.renderRecordContent(rows);
            }
            else{
                var loadingBox = loading.show('加载中...');
                var param = {type: self.type, page:self.pageno, pagesize:self.pagesize,question:$('#searchInp').val()};
                request.ajax(API.list, param, function(data){
                    sessionStorage.setItem(dataKey, JSON.stringify(data.rows));
                    self.renderRecordContent(data.rows);
                    loading.hide(loadingBox);
                }, function(err){
                    self.isLoaded = true;
                    loading.hide(loadingBox);
                    tips('请求超时');
                });
            }
        },
        getNextPageData: function(){
            var self = this;
            var dataKey = 'record_'+self.type+'_'+self.pageno;
            if (sessionStorage.getItem(dataKey)){
                var rows = JSON.parse(sessionStorage.getItem(dataKey));
                self.renderRecordContent(rows);
                loading.removePullDiv();
            }
            else{
                var param = {type: this.type, page:this.pageno, pagesize:this.pagesize,question:$('#searchInp').val()};
                request.ajax(API.list, param, function(data){
                    sessionStorage.setItem(dataKey, JSON.stringify(data.rows));
                    self.renderRecordContent(data.rows);
                    loading.removePullDiv();
                }, function(err){
                    self.isLoaded = true;
                    loading.removePullDiv();
                    tips('请求超时');
                });
            }
        },
        windowScroll: function(e){
            var self = this;
            var windowHeight = $(window).height();
            var scrollTop = $(window).scrollTop();
            var splitHeight = $('.queslistpage').height()-$(window).height();
            var movedHeight = windowHeight*0.2;
            if (self.hasMoreData&&self.isLoaded){
                if(scrollTop+movedHeight>=splitHeight){
                    self.pageno++;
                    self.isLoaded = false;
                    loading.addPullDiv($('.list-item'));
                    self.getNextPageData();
                }
            }
        },
        chooseCategory: function(e){
            var self = this;
            if (self.isLoaded){
                var target = $(e.currentTarget);
                self.changeCurrentCate(target);
            }
        },
        changeCurrentCate: function(target){
            if (!target.hasClass('active')){
                var index = Math.max(target.index()-1,0);
                target.addClass('active');
                target.siblings().removeClass('active');
                this.pageno = 1;
                this.isLoaded = false;
                this.type = target.attr('data-value')||'';
                // this.mySwiper.slideTo(index, 500);
                this.getCurrentData();
            }
        },
        closeRemarkDialog:function(){
            this.remarkDialog.close();
        },
        // moveStart:function(e){
        //     var self = this;
        //     self.startX = e.touches[0].clientX;
        //     self.startY = e.touches[0].clientY;
        //     if(self.startY>=160 && self.startY<=600){
        //         console.log(self.startX,self.startY);
        //     }
        // },
        // moveIng:function(e){
        //     var self = this;
        //     // var target = $(e.currentTarget);
        //     // var moveWidth = target.find('.removeItem').width();
        //     var initwidth = $('.page').width();
        //     var endPosX = e.touches[0].clientX;
        //     var splitPosX = endPosX-self.startX;
        //     if(splitPosX>0){
        //         // pervpage
        //         $('.nextpage').hide();
        //         var moveWidth = initwidth-splitPosX + 'px';
        //         $('.prevpage').css('right',moveWidth);
        //     }else if(splitPosX < 0){
        //         //nextpage
        //         $('.prevpage').hide();
        //         var moveWidth = initwidth+splitPosX + 'px';
        //         $('.nextpage').css('left',moveWidth);
        //     }
        // }
    };
    new Me();
});
