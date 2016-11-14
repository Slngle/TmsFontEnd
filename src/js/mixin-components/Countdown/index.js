import style from './index.css';
var AppStoresForCountdown = require('./store');
var AppActionsForCountdown = require('./action');
var lib = require('lib/index');
var Countdown = React.createClass({
	getInitialState:function() {
		var activeId = this.props.activeId;
		var clickId = this.props.clickId;
		var timeline = this.props.timeline;
		var config = this.props.config || {};
		var activityId_activityType = config.moduleId;

		if(!clickId && clickId!=0) {
			if(activeId == "bigThanAll") {
				var Countdown = {};
				Countdown.activeId = activeId;
				return Countdown;
			}

			if(activeId == "smallThanAll") {
				activeId = 0;
			}

			var Countdown = timeline[activeId];
		}else {
			if(clickId>=activeId) {
				var Countdown = timeline[clickId];
			}else {
				var Countdown = {}
				Countdown.activeId = activeId;
				Countdown.clickId = clickId;
				return Countdown;
			}
			
		}
		
		Countdown.activeId = activeId;
		Countdown.clickId = clickId;
		Countdown.timeline = timeline;
		Countdown.activityId_activityType = activityId_activityType;

		var systemTime = entry.serverTime;
		Countdown.systemTime = systemTime;
		if(!Countdown)	{
			return {}
		}
		var longTimeSystem = lib.timer({time:Countdown.systemTime}).longTime;
		var longTimeStart = lib.timer({time:Countdown.onlineStartTime}).longTime;
		var longTimeEnd = lib.timer({time:Countdown.onlineEndTime}).longTime;
		Countdown.before = true;
        if(lib.timer({time:Countdown.systemTime}).longTime > lib.timer({time:Countdown.onlineStartTime}).longTime) {
            Countdown.before = false;
        }
		Countdown.timeInterval = null;
	    if(Countdown.before) {
	    	Countdown.timeArr = this.timeFirst(longTimeStart,longTimeSystem);
	    }else {
	    	Countdown.timeArr = this.timeFirst(longTimeEnd,longTimeSystem);
	    }
        return Countdown;
    },
    componentDidMount: function() {
    	AppStoresForCountdown.addChangeListener(this._onChange);
    	if(this.state.activeId == 'bigThanAll') {
    		return;
    	} else if(this.state.clickId && this.state.clickId < this.state.activeId) {
    		return;
    	}

        var Countdown = this.state;
        setTimeout(function(){
        	AppActionsForCountdown.setCountdown(Countdown);
        },1);
    },
    componentWillUnmount: function() {
        AppStoresForCountdown.removeChangeListener(this._onChange);
    },
    timeFirst:function (startTime,oDate) {
    	//初始数据date渲染
	    var timeArr = [];
	    var ts = startTime - oDate;//计算剩余的毫秒数  
	    var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数  
	    var hh = parseInt((ts-dd*86400000) /1000 / 60 / 60, 10);//计算剩余的小时数  
	    var mm = parseInt((ts-dd*86400000-hh*3600000) / 1000 / 60 , 10);//计算剩余的分钟数  
	    var ss = parseInt((ts-dd*86400000-hh*3600000-mm*60000)/1000, 10);//计算剩余的秒数  
	    //var dataTime = Number(dd*24)+Number(hh);    
	    dd = dd<0?"00":dd;  
	    hh = hh<0?"00":lib.checkTime({time:hh});  
	    mm = mm<0?"00":lib.checkTime({time:mm});  
	    ss = ss<0?"00":lib.checkTime({time:ss}); 

	    timeArr.push(dd,hh,mm,ss);
	    return timeArr;
	},
	touchMove:function(e) {
		e.preventDefault();
	},
    _onChange: function() {
    	var config = this.props.config;
    	var activityId_activityType = config.moduleId;
    	if(AppStoresForCountdown && AppStoresForCountdown.data && AppStoresForCountdown.data.activityId_activityType == activityId_activityType) {
    		this.setState(AppStoresForCountdown.data); 
    	}

    },
	render: function() {
		var self = this;
		var templateChoose = this.props.template;
		if(this.state.activeId == 'bigThanAll' || this.state.clickIdsmallThanActiveId) {
			return (
				<div className="countdown">
					<div className="countdown-wrap" style={{backgroundColor:templateChoose.backgroundColor}}>
						<div className="countdown-wrap-left">
							<p className="countdown-bottom-p bt-font-size" style={{color:templateChoose.textColor}}>本场还有商品可以继续抢购哦</p>
						</div>
					</div>
				</div>
			)
		}

		var data = this.state.timeArr || [];
		var end = this.state.end;

		var systemTime = this.state.systemTime;
		var startTime  = this.state.onlineStartTime;
		var endTime = this.state.onlineEndTime;

		var startDate = startTime && startTime.split(' ') && startTime.split(' ')[0];

		var dateDifferenceBefore = lib.dateDifference({time1:startTime,time2:systemTime});
		var beforeLessthanOne =  dateDifferenceBefore<1?true:false;

		var dateDifferenceLessTime = lib.dateDifference({time1:endTime,time2:systemTime});
		var endLessthanOne = dateDifferenceLessTime<1?true:false;

		var before = this.state.before;
		var parseTime = startTime && lib.timer({time:startTime});

		if(this.state.before) {
			if(!beforeLessthanOne) {
				var dd = <div className="black-cir">{data && data[0]}</div>;
				var tian = <div className="timer-text">天</div>;
			} else {
				var dd = <div></div>;
				var tian = <div></div>;
			}

			//如果系统时间小于开始的date（date格式为2015-6-4）则显示日期
			var startDateObj = startDate && lib.timer({time:startDate});
			var startDateLongTime = startDateObj && startDateObj.longTime;
			var systemTimeObj = systemTime && lib.timer({time:systemTime});
			var systemTimeLongTime = systemTimeObj && systemTimeObj.longTime;
			if(systemTimeLongTime<startDateLongTime) {
				var html = <div className="countdown-wrap-left">
							<p className="countdown-top-p">{parseTime && (parseTime.mmdd+" "+parseTime._hhmm)}准时开抢</p><p className="countdown-bottom-p" style={{color:templateChoose.textColor}}>距离本场开始还有</p>
						</div>;
			} else {
				var html = <div className="countdown-wrap-left">
								<p className="countdown-top-p">{parseTime && parseTime._hhmm}准时开抢</p>
								<p className="countdown-bottom-p" style={{color:templateChoose.textColor}}>距离本场开始还有</p>
							</div>;			
			}

			var countdownDmfm = <div className="countdown-wrap-right">
									{dd}
									{tian}
									<div className="black-cir">{data && data[1]}</div>
									<div className="timer-text">时</div>
									<div className="black-cir">{data && data[2]}</div>
									<div className="timer-text">分</div>
									<div className="black-cir">{data && data[3]}</div>
									<div className="timer-text">秒</div>
								</div>;
		} else if(!this.state.before) {
			if(!endLessthanOne) {
				var dd = <div className="black-cir">{data && data[0]}</div>;
				var tian = <div className="timer-text">天</div>;
			}else {
				var dd = <div></div>;
				var tian = <div></div>;
			}
			var html = <div className="countdown-wrap-left">
							<p className="countdown-bottom-p bt-font-size" style={{color:templateChoose.textColor}}>距离本场结束还有</p>
						</div>;
			var countdownDmfm = <div className="countdown-wrap-right">
									{dd}
									{tian}
									<div className="black-cir">{data && data[1]}</div>
									<div className="timer-text">时</div>
									<div className="black-cir">{data && data[2]}</div>
									<div className="timer-text">分</div>
									<div className="black-cir">{data && data[3]}</div>
									<div className="timer-text">秒</div>
								</div>;
		}

		return 	(
			<div className="countdown">
				<div className="countdown-wrap" style={{backgroundColor:templateChoose.backgroundColor}}>
					{html}
					{countdownDmfm}
				</div>
			</div>
		)
	}
});

window.AppActionsForCountdown = AppActionsForCountdown;
module.exports = Countdown;