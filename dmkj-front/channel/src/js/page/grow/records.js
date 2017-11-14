require(['zepto','vendor/requestServer','vendor/swiper.min','components/loading','components/Confirm','components/Dialog','components/Tips','nativeApp','template'],function($,request,Swiper,loading,Confirm,Dialog,tips,nativeApp,template) {
    var Me = function(){
        this.pageno = 1;
		this.pagesize = 10;
        this.isLoaded = true;
        this.categoryId = '';
        this.mySwiper = null;
        this.categoryObj = {};
        this.hasMoreData = false;
        this.recordList = [];
        this.selectedRdList = [];
        this.selectedRdIdList = [];
        this.remarkDialog = null;
        this.init();
    };
    
    Me.prototype = {
        init:function(){
            var self = this;
            sessionStorage.clear();
            self.initSwiperBox();
            self.getCurrentData();
            self.getCategoryList();
            nativeApp.callNative('Web.hideBar', {'hide':'y'}, {});
            $(window).on('scroll',$.proxy(this.windowScroll,this));
            $('.growRecordPage .J_edit').on('click', $.proxy(this.editRecordsClick,this));
            $('.growRecordPage .J_confirm').on('click', $.proxy(this.confirmRecord,this));
            $('.growRecordPage .icon-back').on('click', $.proxy(this.closeRecordPage,this));
            $('.growRecordPage').on('click', '.J_selectAll', $.proxy(this.chooseAllRecord,this));
            $('.growRecordPage .categoryList>li').on('click', $.proxy(this.chooseCategory,this));
            $('.growRecordPage .recordsListBox').on('click','tr', $.proxy(this.selectedRecord,this));
            $('.achievementPage .J_createPdf').on('click', $.proxy(this.createPdfFile,this));
            $('.achievementPage').on('click', '.J_addRecord', $.proxy(this.addRecordsClick,this));
            $('.achievementPage .icon-back').on('click', $.proxy(this.backToGrowPage,this));
            $('.achievementPage .workExperience').on('touchstart', 'li', $.proxy(this.recordTouchstart,this));
            $('.achievementPage .workExperience').on('touchmove', 'li', $.proxy(this.recordTouchmove,this));
            $('.achievementPage .workExperience').on('touchend', 'li', $.proxy(this.recordTouchend,this));
            $('.achievementPage .workExperience').on('click', 'li', $.proxy(this.recordClicked,this));
            $('.achievementPage .workExperience').on('touchend', '.removeItem', $.proxy(this.removeRecord,this));
            $(document.body).on('touchend', '.remarkComponent .icon-closefill', $.proxy(this.closeRemarkDialog,this));
            $(document.body).on('click', '.remarkComponent .confirmBtn', $.proxy(this.confirmPdfRecord,this));
            $(document.body).on('keyup change blur', '.remarkComponent #remark', $.proxy(this.validateRemark,this));
        },
        initSwiperBox: function(){
            this.mySwiper = new Swiper('.swiper-container', {
                slidesPerView:'auto'
            });
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
                html = template('recordsListTemp', {rows:rows});
                $('.growRecordPage .recordsListBox').html(html);
            }
            else{
                html = template('recordItemTemp', {rows:rows});
                $('.recordsPageList tbody').append(html);
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
            var dataKey = 'record_'+self.categoryId+'_'+self.pageno;
            $('html,body').scrollTop(0);
            if (sessionStorage.getItem(dataKey)){
                var rows = JSON.parse(sessionStorage.getItem(dataKey));
                self.renderRecordContent(rows);
            }
            else{
                var loadingBox = loading.show('加载中...');
                var param = {categoryId: self.categoryId, page:self.pageno, pagesize:self.pagesize};
                request.ajax('certificateRecordByCatalog', param, function(data){
                    self.concatRecordList(data.rows);
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
            var dataKey = 'record_'+self.categoryId+'_'+self.pageno;
            if (sessionStorage.getItem(dataKey)){
                var rows = JSON.parse(sessionStorage.getItem(dataKey));
                self.renderRecordContent(rows);
                loading.removePullDiv();
            }
            else{
                var param = {categoryId: this.categoryId, page:this.pageno, pagesize:this.pagesize};
                request.ajax('certificateRecordByCatalog', param, function(data){
                    self.concatRecordList(data.rows);
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
            if (!$('.growRecordPage').hasClass('hidden')){
                var windowHeight = $(window).height();
                var scrollTop = $(window).scrollTop();
                var splitHeight = $('.growRecordPage').height()-$(window).height();
                var movedHeight = windowHeight*0.2;
                if (self.hasMoreData&&self.isLoaded){
                    if(scrollTop+movedHeight>=splitHeight){
                        self.pageno++;
                        self.isLoaded = false;
                        loading.addPullDiv($('.recordsPageList'));
                        self.getNextPageData();
                    }
                }
            }
		},
        chooseAllRecord: function(e){
            if (this.hasMoreData){
				tips('请手动向上拉取全部数据后点击全选');
				return;
			}
			else{
				this.selectAllRecord();
			}
        },
		selectAllRecord :function(){
			var self = this;
            var length = $('.recordsPageList tr').length;
            var selectedLen = $('.recordsPageList tr.selected').length;
            if (length!== selectedLen){
                $('.recordsPageList tr').addClass('selected');
            }
            else{
                $('.recordsPageList tr').removeClass('selected');
            }
            $.each($('.recordsPageList tr'),function(idx,node){
                var id = $(node).attr('data-id');
                var index = self.selectedRdIdList.indexOf(id);
                if ($(node).hasClass('selected')){
                    if (index===-1){
                        self.selectedRdIdList.push(id);
                    }
                }
                else{
                    self.selectedRdIdList.splice(index,1);
                }
            });
            console.log('index array is ..', JSON.stringify(self.selectedRdIdList));
            $('.growRecordPage .J_confirm .num').text(self.selectedRdIdList.length);
		},
        chooseCategory: function(e){
            var self = this;
			if (self.isLoaded){
                var target = $(e.currentTarget);
				self.changeCurrentCate(target);
			}
        },
        changeCurrentCate: function(target){
            if (!target.hasClass('selected')){
                var index = Math.max(target.index()-1,0);
                target.addClass('selected');
                target.siblings().removeClass('selected');
                this.pageno = 1;
                this.isLoaded = false;
                this.categoryId = target.attr('data-value')||'';
                this.mySwiper.slideTo(index, 500);
                this.getCurrentData();
            }
        },
        editRecordsClick: function(e){
            $('.growRecordPage .J_edit').addClass('hidden');
            $('.growRecordPage .J_confirm').removeClass('hidden');
            $('.growRecordPage .J_selectAll').removeClass('hidden');
            $('table.recordsPageList').removeClass('forbidEdited');
        },
        getCurrentRecord: function(id){
            var record = null, recordList = this.recordList;
            if (recordList&&recordList.length>0){
                for (var i = 0; i < recordList.length; i++) {
                    var v = recordList[i];
                    if (v.id===id){
                        record = v;
                        break;
                    }
                }
            }
            return record;
        },
        getCurrentCategory: function(recordListByCategory,id){
            var record = null;
            if (recordListByCategory&&recordListByCategory.length>0){
                for (var i = 0; i < recordListByCategory.length; i++) {
                    var v = recordListByCategory[i];
                    if (v.categoryid===id){
                        record = v;
                        break;
                    }
                }
            }
            return record;
        },
        getRecordListByCategory: function(){
            var self = this;
            var recordListByCategory = [],selectedList=[], recordList = this.recordList, categoryList = this.categoryList;
            $.each(this.selectedRdIdList,function(index,value){
                var record = self.getCurrentRecord(value);
                if (record){
                    selectedList.push(record);
                    var isExistsCategory = self.getCurrentCategory(recordListByCategory, record.catalogid1);
                    if (isExistsCategory){
                        isExistsCategory.rows.push(record);
                    }
                    else{
                        var categoryname = categoryList[record.catalogid1];
                        recordListByCategory.push({categoryid: record.catalogid1, categoryname: categoryname, rows: [record]});
                    }
                }
            });
            this.selectedRdList = selectedList;
            return recordListByCategory;
        },
        confirmRecord: function(e){
            var self = this, selectedList = [];
            var recordList = this.recordList;
            if ((this.selectedRdIdList&&this.selectedRdIdList.length>0)&&(recordList&&recordList.length>0)){
                $('.achievementPage').removeClass('hidden');
                var recordListByCate = self.getRecordListByCategory();
                var html = template('recordLiItemTemp', {recordListByCate:recordListByCate});
                $('.achievementPage .workExperience').html(html);
                $('.recordPanel').addClass('move');
                $('.recordPanel').one('webkitTransitionEnd',function(){
                    $('.growRecordPage').addClass('hidden');
                    $('html,body').scrollTop(0);
                });
            }
            else{
                tips('请至少选择一条记录');
                return false;
            }
        },
        createPdfFile: function(){
            if (this.selectedRdList&&this.selectedRdList.length>0){
                this.remarkDialog = new Dialog($('#remarkInfoTemp').html(),'');
            }
            else{
                tips('请至少选择一条记录');
                return false;
            }
        },
        closeRemarkDialog:function(){
            this.remarkDialog.close();
        },
        confirmPdfRecord: function(e){
            var self = this, recordsList = [];
            var remark = $('#remark').val();
            var target = $(e.currentTarget);
            var loadingBox = loading.show('生成中');
            target.addClass('disabled');
            $.each(this.selectedRdList, function(i,item){
                recordsList.push({
                    id: item.userid,
                    opdate: item.opdate,
                    openddate: item.openddate,
                    evaluate: item.evaluate,
                    level: item.level,
					channel: item.channel,
                    content: item.basecontent,
                    categoryid: item.catalogid1,
                    catalog1name: item.catalog1name
                });
            });
            $.ajax({
                url: 'generateCertificateInfoPdf',
                type: 'POST',
                contentType : 'application/json;charset=utf-8',
                dataType:'json',
                data: JSON.stringify({recordsList: recordsList,remark: remark}),
                success: function (data, status) {
                    if (data.code === '100'){
                        setTimeout(function(){
                            loading.hide(loadingBox);
                            target.removeClass('disabled');
                            self.closeRemarkDialog();
                            nativeApp.callNative('Web.closeAndRefreshList', {}, {});
                        },5000);
                    }
                    else{
                        tips(data.msg);
                        loading.hide(loadingBox);
                        target.removeClass('disabled');
                    }
                },
                error: function(err){
                    tips('请求超时');
                    loading.hide(loadingBox);
                    target.removeClass('disabled');
                }
            });
        },
        addRecordsClick: function(e){
            var categoryid = $(e.currentTarget).attr('data-categoryid');
            var selectedCategory = $('.growRecordPage .categoryList>li[data-value="'+categoryid+'"]');
            if (!selectedCategory.is('li')){
               selectedCategory = $('.growRecordPage .categoryList>li').eq(0);
            }
            $('.growRecordPage').removeClass('hidden');
            $('.recordPanel').removeClass('move');
            this.changeCurrentCate(selectedCategory);
            $('.recordPanel').one('webkitTransitionEnd',function(){
                $('.achievementPage').addClass('hidden');
                $('html,body').scrollTop(0);
            });
        },
        backToGrowPage: function(){
            $('.growRecordPage').removeClass('hidden');
            $('.recordPanel').removeClass('move');
            $('.recordPanel').one('webkitTransitionEnd',function(){
                $('.achievementPage').addClass('hidden');
                $('html,body').scrollTop(0);
            });
        },
        closeRecordPage: function(){
            if (this.selectedRdIdList.length>0){
                Confirm('取消生成成绩单吗？', function(){
                    nativeApp.callNative('Web.close', {}, {});
                });
            }
            else{
                nativeApp.callNative('Web.close', {}, {});
            }
        },
        recordTouchstart: function(e){
            $('.createPdfRecords>li').css({left:0});
            this.startPosX = e.touches[0].clientX;
        },
        recordTouchmove: function(e){
            var target = $(e.currentTarget);
            var moveWidth = target.find('.removeItem').width();
            var endPosX = e.touches[0].clientX;
            var splitPosX = endPosX-this.startPosX;
            var originLeft = Number(target.css('left').replace('px',''));
            var posLeft = originLeft+splitPosX;
            posLeft = Math.max(-moveWidth,Math.min(posLeft,0));
			if (Math.abs(posLeft)>5){
				e.preventDefault();
			}
            target.css({'left':posLeft});
            this.startPosX = endPosX;
        },
        recordTouchend: function(e){
            var target = $(e.currentTarget);
            var moveWidth = target.find('.removeItem').width();
            var originLeft = Number(target.css('left').replace('px',''));
            if (Math.abs(originLeft)>(moveWidth/2)){
                target.css({'left':-moveWidth});
            }
            else{
                target.css({'left':0});
            }
        },
        recordClicked: function(e){
            var target = $(e.currentTarget);
            target.css({'left':0});
        },
        validateRemark: function(e){
            var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
            var target = $(e.target);
            target.val(target.val().replace(regStr,''));
        },
        removeRecord: function(e){
            var self = this;
            var target = $(e.currentTarget).parents('li');
            var id = target.attr('data-id');
            target.css({left: '-100%'});
            target.on('webkitTransitionEnd',function(){
                if (target.siblings().length===0){
                    target.parents('.recordsCategoryItem').remove();
                }
                else{
                    target.remove();
                }
                $('.growRecordPage .recordsListBox tr[data-id="'+id+'"]').removeClass('selected');
                var index = self.selectedRdIdList.indexOf(id);
                self.selectedRdIdList.splice(index,1);
                self.selectedRdList.splice(index,1);
                $('.growRecordPage .J_confirm .num').text(self.selectedRdIdList.length);
            });
            return false;
        }
    };
    new Me();
});
