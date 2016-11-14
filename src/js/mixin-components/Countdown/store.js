var EventEmitter  = require('events').EventEmitter;
var assign = require('lib/object-assign');
var AppDispatcher = require('dispatch');
var timeInterval = null;
var EVENT_CHANGE = 'store::change';
var lib = require('lib/index');
var AppStoresForCountdown = assign({}, EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(EVENT_CHANGE, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(EVENT_CHANGE, callback);
  },
  emitChange: function() {
    this.emit(EVENT_CHANGE);
  },
});

AppDispatcher.register(function(payload) {
  var action = payload;
  switch(action.actionType) {
    case "setCountdown":
      return setCountdown(action.params);
    default:
      return true;
  }
});

function checkTime(s) {
    if(s<10) {
        var arr = '0'+s;
        return arr;
    }
    else if(s>=10) {
        return s;
    }
}

//startTime 还未到达的时间
//oDate 现在的时间
function time(startTime,oDate,before,params) {
    var pushDatac = pushData;
    var timeArr = [];
    var ts = startTime - oDate;//计算剩余的毫秒数  
    var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数  
    var hh = parseInt((ts-dd*86400000) /1000 / 60 / 60, 10);//计算剩余的小时数  
    var mm = parseInt((ts-dd*86400000-hh*3600000) / 1000 / 60 , 10);//计算剩余的分钟数  
    var ss = parseInt((ts-dd*86400000-hh*3600000-mm*60000)/1000, 10);//计算剩余的秒数  

    var thisTime = new Date(oDate);
    dd = dd;  
    hh = checkTime(hh);  
    mm = checkTime(mm);  
    ss = checkTime(ss);  
    timeArr.push(dd,hh,mm,ss);
    pushDatac.timeArr = timeArr;
    pushDatac.before = before;
    pushDatac.timeInterval = timeInterval;
    pushDatac.systemTime = thisTime.getFullYear() + "-" + (thisTime.getMonth()+1) + "-" +thisTime.getDate()+" "+thisTime.getHours()+":"+thisTime.getMinutes()+":"+thisTime.getSeconds();
    pushDatac.clickIdsmallThanActiveId = false;
    AppStoresForCountdown.data = pushDatac;
    AppStoresForCountdown.emitChange();
}

var once = 1;
var onceBegin = 1;
function cacularTime(oDate,startTime,endTime,shouldShow,params) {    
    var oDateSend = new Date(oDate);
    window.serverTime = oDateSend.getFullYear() +'-' +(oDateSend.getMonth()+1)+'-'+oDateSend.getDate()+" "+oDateSend.getHours()+":"+oDateSend.getMinutes()+":"+oDateSend.getSeconds();
    if(oDate<startTime) {
        var date1 = new Date(oDate);
        var date2 = new Date(startTime);
        var date3 = new Date(endTime);
    } else if(oDate>=startTime) {
        var date1 = new Date(oDate);
        var date2 = new Date(startTime);
        var date3 = new Date(endTime);           
    }

    var pushDatac = pushData;
    if(oDate<startTime) {
        time(startTime,oDate,true,params);
    } else if((oDate>startTime || oDate==startTime) && oDate<endTime) {
        if(shouldShow) {
           time(endTime,oDate,false,params);
         }else {
            clearInterval(timeInterval);
         }
    } else if(oDate>endTime || oDate==endTime) {
        clearInterval(timeInterval);
        pushDatac.end = true;
        pushDatac.timeArr = ['00','00','00','00'];
        pushDatac.timeInterval = timeInterval;
        pushDatac.clickIdsmallThanActiveId = false;
        //可能会有早传一秒的问题
        setTimeout(function(){
                var timeline = params.timeline;
                var activityId_activityType = params.activityId_activityType;
                var data = {
                    timeline:timeline,
                    activityId_activityType:activityId_activityType,
                    sourse:activityId_activityType+'_countdown'
                }
                console.log(444,data);
                clearInterval(timeInterval);
                window.AppActionsForTimeline && AppActionsForTimeline.setTimeline(data);
                window.AppActionsForTimelineMoudle && AppActionsForTimelineMoudle.setTimelineMoudle(data);

        },1);

        AppStoresForCountdown.data = pushDatac;
        AppStoresForCountdown.emitChange();
    }
}
var pushData;
function setCountdown(params) {
    console.log(params);
    timeInterval && clearInterval(timeInterval);
    params.shouldShow = true;
    pushData = params;
    var clickId =  params.clickId;
    var activeId = params.activeId;

    if(activeId=='smallThanAll') {
        activeId == '0';
    }

    if(!clickId && clickId!=0) {
        //没有clickId
        if(activeId == 'bigThanAll') {
            AppStoresForCountdown.data = {
                activityId_activityType:params.activityId_activityType,
                activeId:activeId
            };
            AppStoresForCountdown.emitChange();
            return;
        }

        var systemTime = lib.timer({time:params.systemTime}).longTime;
        var oDate = new Date().getTime();
        var startTime = lib.timer({time:params.onlineStartTime}).longTime - systemTime + oDate;
        var endTime = lib.timer({time:params.onlineEndTime}).longTime - systemTime + oDate; 
        var shouldShow = params.shouldShow;//是否显示距离结束还有多少时间
        clearInterval(timeInterval);
        timeInterval = setInterval(function() {
            cacularTime(oDate,startTime,endTime,shouldShow,params);
            oDate = new Date().getTime();
        },1000);  
    }else {
        if(clickId<activeId || activeId == 'bigThanAll') {
            AppStoresForCountdown.data = {
                activityId_activityType:params.activityId_activityType,
                clickIdsmallThanActiveId:true
            };
            AppStoresForCountdown.emitChange();
            return;
        }else {
            var systemTime = lib.timer({time:params.systemTime}).longTime;
            var oDate = new Date().getTime();
            var startTime = lib.timer({time:params.onlineStartTime}).longTime - systemTime + oDate;
            var endTime = lib.timer({time:params.onlineEndTime}).longTime - systemTime + oDate; 
            var shouldShow = params.shouldShow;//是否显示距离结束还有多少时间
            clearInterval(timeInterval);
            timeInterval = setInterval(function() {
                cacularTime(oDate,startTime,endTime,shouldShow,params);
                oDate = new Date().getTime();
            },1000);        
        }
    }
}

AppStoresForCountdown.initData = {
    systemTime:'',
    startTime:'',
    endTime:'',
    timeArr:[],
    end:false,
    before:true,
    timeInterval:timeInterval
}

module.exports = AppStoresForCountdown;