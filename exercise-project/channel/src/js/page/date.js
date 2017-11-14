require(['zepto','iosselect','components/Tips'],function($, IosSelect, tips){

    var me = function(){
        this.init();
    };
    me.prototype = {
        init:function(){
            var selectDateDom = $('#selectDate'),
                showDateDom = $('#showDate'),
                selectDateDom2 = $('#selectDate2'),
                showDateDom2 = $('#showDate2'),
                nows = $('input[name="currentDate"]').val().split('-'),
                date2 = showDateDom2.html().split('-'),
                date1 = showDateDom.html().split('-'),
                nowYear = parseInt(nows[0]),
                nowMonth = parseInt(nows[1]),
                nowDate = parseInt(nows[2]);
            showDateDom.attr('data-year',date1[0] );
            showDateDom.attr('data-month', date1[1]);
            showDateDom.attr('data-date', date1[2]);
            showDateDom2.attr('data-year',date2[0]);
            showDateDom2.attr('data-month',date2[1]);
            showDateDom2.attr('data-date', date2[2]);console.log(nows[0]);
            // 数据初始化
            function formatYear (startYear,overYear) {
                var arr = [];
                for (var i = startYear; i <= overYear; i++) {
                    arr.push({
                        id: i + '',
                        value: i
                    });
                }
                return arr;
            }
            function formatMonth (startMonth,overMonth) {
                var arr = [];
                for (var i = startMonth; i <= overMonth; i++) {
                    arr.push({
                        id: i + '',
                        value: i
                    });
                }
                return arr;
            }
            function formatDate (start,count) {
                var arr = [];
                for (var i = start; i <= count; i++) {
                    arr.push({
                        id: i + '',
                        value: i
                    });
                }
                return arr;
            }
            var yearData = formatYear(nowYear-5,nowYear);
            var monthData = function (year, callback) {
                if(year == nowYear){
                    callback(formatMonth(1,nowMonth));
                }else{
                    callback(formatMonth(1,12));
                }
            };
            var dateData = function (year, month, callback) {
                if(month == nowMonth && year == nowYear){
                    callback(formatDate(1,nowDate));
                }else{
                    if (/^(1|3|5|7|8|10|12)$/.test(month)) {
                        callback(formatDate(1,31));
                    }
                    else if (/^(4|6|9|11)$/.test(month)) {
                        callback(formatDate(1,30));
                    }
                    else if (/^2$/.test(month)) {
                        if (year % 4 === 0 && year % 100 !==0 || year % 400 === 0) {
                            callback(formatDate(1,29));
                        }
                        else {
                            callback(formatDate(1,28));
                        }
                    }
                    else {
                        tips('month is illegal');
                    }
                }
            };
            selectDateDom.on('click', function () {
                var oneLevelId = showDateDom.attr('data-year');
                var twoLevelId = showDateDom.attr('data-month');
                var threeLevelId = showDateDom.attr('data-date');
                var iosSelect = new IosSelect(3,
                    [yearData, monthData, dateData],
                    {
                        title: '日期选择',
                        itemHeight: 35,
                        relation: [1, 1],
                        oneLevelId: oneLevelId,
                        twoLevelId: twoLevelId,
                        threeLevelId: threeLevelId,
                        showLoading: false,
                        callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                            showDateDom.attr('data-year', selectOneObj.id);
                            showDateDom.attr('data-month', selectTwoObj.id);
                            showDateDom.attr('data-date', selectThreeObj.id);
                            showDateDom.html(selectOneObj.value + '-' + selectTwoObj.value + '-' + selectThreeObj.value);
                        }
                });
            });
            //结束时间初始化
            selectDateDom2.on('click', function () {
                var startChoseY = parseInt(showDateDom.attr('data-year'));
                var startChoseM = parseInt(showDateDom.attr('data-month'));
                var startChoseD = parseInt(showDateDom.attr('data-date'));

                var yearData2 = formatYear(startChoseY,nowYear);
                var monthData2 = function (year, callback) {
                    if(year == startChoseY && year == nowYear){
                        callback(formatMonth(startChoseM, nowMonth));
                    }else if(year == startChoseY && year != nowYear){
                        callback(formatMonth(startChoseM,12));
                    }
                    else if(year == nowYear){
                        callback(formatMonth(1,nowMonth));
                    }
                    else{
                        callback(formatMonth(1,12));
                    }
                };
                var dateData2 = function (year, month, callback) {
                    if( year == startChoseY && year == nowYear && month == nowMonth && month == startChoseM ){
                        callback(formatDate(startChoseD,nowDate));
                    }else if(year == startChoseY && month == startChoseM){
                        if (/^(1|3|5|7|8|10|12)$/.test(month)) {
                            callback(formatDate(startChoseD,31));
                        }
                        else if (/^(4|6|9|11)$/.test(month)) {
                            callback(formatDate(startChoseD,30));
                        }
                        else if (/^2$/.test(month)) {
                            if (year % 4 === 0 && year % 100 !==0 || year % 400 === 0) {
                                callback(formatDate(startChoseD,29));
                            }
                            else {
                                callback(formatDate(startChoseD,28));
                            }
                        }
                        else {
                            tips('month is illegal');
                        }
                    }
                    else if(year == nowYear && month == nowMonth){
                         callback(formatDate(1,nowDate));
                    }
                    else{
                        if (/^(1|3|5|7|8|10|12)$/.test(month)) {
                            callback(formatDate(1,31));
                        }
                        else if (/^(4|6|9|11)$/.test(month)) {
                            callback(formatDate(1,30));
                        }
                        else if (/^2$/.test(month)) {
                            if (year % 4 === 0 && year % 100 !==0 || year % 400 === 0) {
                                callback(formatDate(1,29));
                            }
                            else {
                                callback(formatDate(1,28));
                            }
                        }
                        else {
                            tips('month is illegal');
                        }
                    }
                };

                var iosSelect = new IosSelect(3,
                    [yearData2, monthData2, dateData2],
                    {
                        title: '日期选择',
                        itemHeight: 35,
                        relation: [1, 1],
                        oneLevelId: startChoseY,//一级默认值
                        twoLevelId: startChoseM,//二级默认值
                        threeLevelId: startChoseD,//三级默认值
                        showLoading: false,
                        callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                            showDateDom2.attr('data-year', selectOneObj.id);
                            showDateDom2.attr('data-month', selectTwoObj.id);
                            showDateDom2.attr('data-date', selectThreeObj.id);
                            showDateDom2.html(selectOneObj.value + '-' + selectTwoObj.value + '-' + selectThreeObj.value);

                        }
                    });
            });

        }
    };
    new me();

});
