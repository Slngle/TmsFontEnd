import style from './index.css';
var AppStoresForTimelineMoudle = require('./store');
var AppActionsForTimelineMoudle = require('./action');
var lib = require('lib/index');
var Countdown = require('mixinComponents/Countdown/index');
var top;
var Sticky = require('mixinComponents/Sticky/index');
var edit = [];
var TimelineMoudle = React.createClass({
	getInitialState:function() {
		var config = this.props.config;
		var systemTime = entry['serverTime'];
		var activityId_activityType = config.moduleId;
		var oDateSend = new Date();
		var self = this;
		window.serverTime = oDateSend.getFullYear() +'-' +(oDateSend.getMonth()+1)+'-'+oDateSend.getDate()+" "+oDateSend.getHours()+":"+oDateSend.getMinutes()+":"+oDateSend.getSeconds();
		
		var list = config && config.list || [];
		var startDate = config && config.startDate;
		var endDate = config && config.endDate;
		for(var i=0;i<list.length;i++) {
			var onlineStartTime = list[i].onlineStartTime ;
			var onlineEndTime = list[i].onlineEndTime ;

			var systemTimeLong = systemTime && this.dateParse({date:systemTime});
			var startDateLong = startDate && this.dateParse({date:startDate});
			var endDataAdd24 = endDate+' '+'23:59:59';

			var endDateLong = endDate && this.dateParse({date:endDataAdd24});
			//系统时间>=结束日期 则activeId 为bigThanAll
			//系统时间<开始日期 则activeId 为smallThanAll 同时倒计时的onlineEndTime的date设为startDate
			//系统时间>=开始日期 && 系统时间<结束日期 则将系统时间设为开始时间和结束时间

			if(systemTimeLong>=endDateLong) {
				var activeId = 'bigThanAll';
				if(i == list.length-1) {
					list[i].onlineStartTime = startDate + " " + onlineStartTime;
					list[i].onlineEndTime = endDate + " " + "23:59:59";				
				}else {
					list[i].onlineStartTime = startDate + " " + onlineStartTime;
					list[i].onlineEndTime = endDate + " " + list[i+1].onlineStartTime
				}
			} else if(systemTimeLong<startDateLong) {
				var activeId = 'smallThanAll';
				if(i == list.length-1) {
					list[i].onlineStartTime = startDate + " " + onlineStartTime;
					list[i].onlineEndTime = startDate + " " + "23:59:59";				
				}else {
					list[i].onlineStartTime = startDate + " " + onlineStartTime;
					list[i].onlineEndTime = startDate + " " + list[i+1].onlineStartTime
				}		
			} else if(systemTimeLong>=startDateLong && systemTimeLong<endDateLong) {
				var systemDate =  systemTime && systemTime.split(' ')[0];
				if(i == list.length-1) {
					list[i].onlineStartTime = systemDate + " " + onlineStartTime;
					list[i].onlineEndTime = systemDate + " " + "23:59:59";				
				}else {
					list[i].onlineStartTime = systemDate + " " + onlineStartTime;
					list[i].onlineEndTime = systemDate + " " + list[i+1].onlineStartTime
				}	
			}
		}
		var timeline = list;

		//如果activeId存在 既 进入bigthanall smallThanAll 里面 就不初始化activeId
		if(!activeId) {
			var activeId = this.getActiveIdNow({
				nowTime:systemTime,
				timeline:timeline
			});
		}

		//字符串的moduleId
		if(activeId == 'smallThanAll') {
			var activeRelevanceModule = timeline && timeline[0] && timeline[0].relevanceModule;
		}else if(activeId == 'bigThanAll') {
			var length = timeline && timeline.length && timeline.length-1;
			var activeRelevanceModule = timeline && timeline[length] && timeline[length].relevanceModule;
		}else {
			var activeRelevanceModule = timeline && timeline[activeId] && timeline[activeId].relevanceModule;			
		}
		//注册一个事件
		document.addEventListener('ondataavailable',function() {
			var node = document.getElementById(activityId_activityType);
			top = node && self.getTop(node);
			self.clearAll({timeline:timeline});
			self.setDisplay({activeRelevanceModule:activeRelevanceModule});
			window.img && window.img.fireLazyload();
		},false);
		if(timeline) {
			return {
				timeline:timeline,
				activeId:activeId,
				activityId_activityType:activityId_activityType,
				systemTime:systemTime
			};
		} else {
			return {
				timeline:[],
				activeId:0,
				activityId_activityType:activityId_activityType,
				systemTime:systemTime
			};
		}
        
    },
    componentDidMount: function() {
    	if(!this.state.timeline || this.state.timeline.length == 0) {
    		return;
    	}

    	var self = this;
        AppStoresForTimelineMoudle.addChangeListener(this._onChange);
        setTimeout(function() {
			var comStickyWrap = document.querySelector('.timelineWrap');
			var activeType = document.querySelector('.timeline-list-active'); 
			if(activeType) {
				var comStickyWrapScrollLeft = activeType.offsetLeft + 2*activeType.offsetWidth - comStickyWrap.offsetWidth 
				lib.moveFn(comStickyWrap,{scrollLeft:comStickyWrapScrollLeft});
			}
			var activeId = self.state.activeId;
			var timeline = self.state.timeline;
		},20);
    },
    componentWillUnmount: function() {
        AppStoresForTimelineMoudle.removeChangeListener(this._onChange);
    },
    componentDidUpdate: function(prevProps, prevState) {
    	if(!this.state.timeline || this.state.timeline.length == 0) {
    		return;
    	}
    	var self = this;
		window.img && window.img.fireLazyload();
		setTimeout(function() {
			var comStickyWrap = document.querySelector('.timelineWrap');
			var activeType = document.querySelector('.timeline-list-active'); 
			if(activeType) {
				var comStickyWrapScrollLeft = activeType.offsetLeft + 2*activeType.offsetWidth - comStickyWrap.offsetWidth ;
				lib.moveFn(comStickyWrap,{scrollLeft:comStickyWrapScrollLeft});
			}
		},20);
	},
	clearAll:function(params) {
		//获取全部的moduleId的dom并把他们全部隐藏
		var timeline = params.timeline;
		var aaa = [];
		for(var i=0;i<timeline.length;i++) {
			var relevanceModule = timeline[i] && timeline[i].relevanceModule;
			var relevanceModuleArr = relevanceModule && relevanceModule.split(',');
			for(var j=0;j<relevanceModuleArr.length;j++) {
				var moduleIdDom = document.getElementById(relevanceModuleArr[j]);
				if(moduleIdDom) {
					moduleIdDom.style.display = 'none';
				}
			}
		}
	},
	setDisplay:function(params){
		var activeRelevanceModule = params.activeRelevanceModule;
		//数组moduleId
		var splitActiveRelevanceModule = activeRelevanceModule && activeRelevanceModule.split(',');
		//dom 节点
		var domSplitActiveRelevanceModule = [];

		for(var i=0;i<splitActiveRelevanceModule.length;i++) {
			var dom = document.getElementById(splitActiveRelevanceModule[i]);
			domSplitActiveRelevanceModule.push(dom);
		}

		if(edit && edit.length) {
			for(var i=0;i<edit.length;i++) {
				if(edit[i]) {
					edit[i].style.display = 'none';
				}
			}
		}

		for(var i=0;i<domSplitActiveRelevanceModule.length;i++) {
			if(domSplitActiveRelevanceModule[i]) {
				domSplitActiveRelevanceModule[i].style.display = 'block';
			}
		}

		edit = domSplitActiveRelevanceModule.concat([]);
	},
	getActiveIdNow:function(params) {
		if(!params || !params.nowTime) {
			return false;
		}
		var config = this.props.config;
		var nowTime = params.nowTime;
		var timeline =	params.timeline;
		var systemTimeLongTime = this.dateParse({date:nowTime});
		var activeId;

		for(var i=0;i<timeline.length;i++) {
			var startTime =  timeline[i] && timeline[i].onlineStartTime && this.dateParse({date:timeline[i].onlineStartTime});
			var endTime = timeline[i] && timeline[i].onlineEndTime && this.dateParse({date:timeline[i].onlineEndTime});
			if(timeline.length == 1) {
				if(systemTimeLongTime>=endTime) {
					activeId = 'bigThanAll';
					break;
				}else if(systemTimeLongTime>=startTime) {
					activeId = i; 
					break;
				}else if(systemTimeLongTime<startTime) {
					activeId = 'smallThanAll';
					break;
				}				
			}else if(i==0) {
				if(systemTimeLongTime<startTime) {
					activeId = 'smallThanAll';
					break;
				}
			}else if(i==timeline.length-1) {
				if(systemTimeLongTime>=endTime) {
					activeId = 'bigThanAll';
					break;
				}else if(systemTimeLongTime>=startTime) {
					activeId = i; 
					break;
				}
			}else {
				var startTime2 = this.dateParse({date:timeline[i+1].onlineStartTime});
				if(systemTimeLongTime>=startTime && systemTimeLongTime<startTime2) {
					activeId = i; 
					break;
				}				
			}
		}
		if(!activeId) {
			activeId= 0;
		}
		return activeId;
	},
	touchMove:function(e) {
		e.preventDefault();
	},
    _onChange: function() {
    	var self = this;
    	//这边的也要用ajax代替 获取时间
    	var activeId = this.getActiveIdNow({nowTime:window.serverTime,timeline:self.state.timeline});
    	if(activeId || activeId==0) {
			AppStoresForTimelineMoudle.data.activeId = activeId;
    	}
    	if(AppStoresForTimelineMoudle.data.sourse == this.state.activityId_activityType+'_countdown') {
    		setTimeout(function(){
				self.setCountdownData();
    		},1);
    	}

        this.setState(AppStoresForTimelineMoudle.data); 
    },
    getLeft:function(e) {
    	var offset=e.offsetTop;
	    if(e.offsetParent!=null) offset+=this.getLeft(e.offsetParent);
	    return offset;
    },
    dateParse:function(params) {
    	var date = params.date;
    	var re = /-/g;
    	date = date.replace(re,"/");
    	var newDate = new Date(date).getTime()
    	return newDate;
    },
    setStoreState:function(params){
    	var config = this.props.config;
    	var activityId_activityType = this.state.activityId_activityType;
    	var id = params.id;
    	var clickId = params.clickId;
    	var activeId = this.state.activeId;
    	AppActionsForTimelineMoudle.setTimelineMoudle({clickId:clickId,activeId:activeId,sourse:activityId_activityType+'_self'});
    },
	setCountdownData:function(params){
		//需要改动点
		// 改用ajax请求数据
    	var config = this.props.config;
    	var activityId_activityType = this.state.activityId_activityType;
    	var timeline = this.state.timeline || {};
    	var clickId = params && params.clickId;
    	var activeId = this.state.activeId;

		if(!clickId && clickId!=0) {
			var params={
				activityId_activityType:activityId_activityType,
				timeline:timeline,
				clickId:null,
				activeId:activeId,
				systemTime:window.serverTime,
				onlineStartTime:timeline[activeId] && timeline[activeId].onlineStartTime,
				onlineEndTime:timeline[activeId] && timeline[activeId].onlineEndTime,
			}
			AppActionsForCountdown.setCountdown(params);
		} else {
			if(clickId<activeId) {
				var params = {
					activityId_activityType:activityId_activityType,
					timeline:timeline,
					clickId:clickId,
					activeId:activeId,
					systemTime:window.serverTime,
				}
				AppActionsForCountdown.setCountdown(params);
			} else {
				var params = {
					activityId_activityType:activityId_activityType,
					timeline:timeline,
					clickId:clickId,
					activeId:activeId,
					systemTime:window.serverTime,
					onlineStartTime:timeline[clickId] && timeline[clickId].onlineStartTime,
					onlineEndTime: timeline[clickId] && timeline[clickId].onlineEndTime,
				}
				AppActionsForCountdown.setCountdown(params);
			}
		}
	},
	getTop:function(e) {
	    var offset=e.offsetTop;
	    if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent);
	    return offset;
	},
	getNode:function(params) {
		var target = params.target;
		var className = params.className;
		while(target) {
			if(target && (target = target.parentNode) && target.nodeType != target.DOCUMENT_NODE && target.classList.contains(className)) {
				break;
			}
		}
		return target;
	},
    click:function(params) {
    	var config = this.props.config;
    	var activityId_activityType = this.state.activityId_activityType;
    	var timeline = this.state.timeline;
    	var id = params.id;
    	this.setStoreState({id:id,clickId:id});
    	var ev = params.ev;
    	var target = ev.target;
		var node = this.getNode({target:target,className:'timeline'});
		top = (top || top==0) || this.getTop(node);
		(top || top ==0 ) && lib.changeScrollTop({distance:top});
		var clickId = id;

		this.setCountdownData({clickId:clickId})


		//改变display逻辑
		var activeRelevanceModule = params.relevanceModule;
		this.setDisplay({activeRelevanceModule:activeRelevanceModule});
    },
	render: function() {
		var self = this;
		var activeId = this.state.activeId;
		var clickId = this.state.clickId;
		var config = this.props.config;
		var templateChoose = window.templateChoose;
		var timelineT = templateChoose && templateChoose.timeline || {};
		var activityId_activityType = this.state.activityId_activityType;
		var timeline = this.state.timeline;

		if(!timeline || timeline.length==0) {
			return(
				<div></div>
			)
		}else if(timeline.length<2) {
			return (
				<Sticky config={config} classSend="height90" id={activityId_activityType}>
					<Countdown activeId = {activeId} clickId = {clickId} activityId_activityType={activityId_activityType}  timeline = {timeline} config = {config} template={timelineT.countdown} />
				</Sticky>
			)
		}

		var timelist = timeline.map(function(data,i) {
			if(!clickId && clickId!=0) {

				if(activeId == 'bigThanAll' && i == timeline.length-1) {
					var className = 'timeline-list-active';
				}else if(i==activeId) {
					var className = 'timeline-list-active';
				}else {
					var className = 'timeline-list';
				}

				if(i==0) {
					className += " listMr";
				}
			}else {
				if(i==clickId) {
					var className = 'timeline-list-active';
				}else {
					var className = 'timeline-list';
				}

				if(i==0) {
					className += " listMr";
				}				
			}

			if(activeId == 'bigThanAll'){
				var qianState = <div className="timeline-list-bottom">已开抢</div>;
			}else if(activeId == 'smallThanAll') {
				var qianState = <div className="timeline-list-bottom">请等待</div>;
			}else if(i<activeId) {
				var qianState = <div className="timeline-list-bottom">已开抢</div>;
			}else if(i == activeId){
				var qianState = <div className="timeline-list-bottom">开抢中</div>;
			}else {
				var qianState = <div className="timeline-list-bottom">请等待</div>;				
			}

			return(
				<div className={className} data-id={i} onClick={function(ev){self.click({id:i,ev:ev,relevanceModule:data.relevanceModule})}}>
					<div className="timeline-list-top">
						{data.name}
					</div>
					{qianState}
				</div>
			)
		});

		if(timeline.length == 2) {
			var timelistWrap = <div className="timelistWrap">{timelist}</div>
		}else if(timeline.length == 3) {
			var timelistWrap = <div className="timelistWrap3">{timelist}</div>
		}else if(timeline.length == 4) {
			var timelistWrap = <div className="timelistWrap4">{timelist}</div>
		}else if(timeline.length > 4) {
			var timelistWrap = <div className="timelistWrap5">{timelist}</div>
		}

		return (
			<Sticky config={config} classSend="height200" id={activityId_activityType}>
				<div className="timeline" style={{backgroundColor:timelineT.backgroundColor}}>
					<div className="timelineWrap">
						<div className="timelineWrapWebkit">
							{timelistWrap}
						</div>
					</div>
				</div>
				<Countdown activityId_activityType={activityId_activityType} timeline = {timeline} activeId = {activeId} clickId={clickId} config = {config} template={timelineT.countdown} />
			</Sticky>
		)
	}

});

window.AppActionsForTimelineMoudle = AppActionsForTimelineMoudle;
module.exports = TimelineMoudle;
