import style from './index.css';
var AppStoresForTimeline = require('./store');
var AppActionsForTimeline = require('./action');
var lib = require('lib/index');
var Countdown = require('mixinComponents/Countdown/index');
var top;
var Sticky = require('mixinComponents/Sticky/index');
var Timeline = React.createClass({
	getInitialState:function() {
		var config = this.props.config;
		var activityId = config.activityId;
		var activityType = config.activityType;
		var activityId_activityType = lib.combine([activityId,activityType]);
		var connect = config.connect || [];
		var connectList = [];

		for(var i=0;i<connect.length;i++) {
			connectList.push({
				activityId_activityType:connect[i].relevanceData,
				connectType:connect[i].relevanceModule,
				data:entry[connect[i].relevanceData]
			});
		}

		var timeline = entry[activityId_activityType];
		var systemTime = entry['serverTime'];
		var oDateSend = new Date();
		window.serverTime = oDateSend.getFullYear() +'-' +(oDateSend.getMonth()+1)+'-'+oDateSend.getDate()+" "+oDateSend.getHours()+":"+oDateSend.getMinutes()+":"+oDateSend.getSeconds();
		
		var activeId = this.getActiveIdNow({
			nowTime:systemTime
		});

		if(timeline) {
			return {
				timeline:timeline,
				activeId:activeId,
				connectList:connectList,
				activityId_activityType:activityId_activityType
			};
		}else {
			return {
				timeline:[],
				activeId:0,
				connectList:[],
				activityId_activityType:activityId_activityType
			};
		}
        
    },
    componentDidMount: function() {
    	if(!this.state.timeline || this.state.timeline.length == 0) {
    		return;
    	}
    	var self = this;
        AppStoresForTimeline.addChangeListener(this._onChange);
        setTimeout(function() {
			var comStickyWrap = document.querySelector('.timelineWrap');
			var activeType = document.querySelector('.timeline-list-active'); 
			if(activeType) {
				var comStickyWrapScrollLeft = activeType.offsetLeft + 2*activeType.offsetWidth - comStickyWrap.offsetWidth 
				lib.moveFn(comStickyWrap,{scrollLeft:comStickyWrapScrollLeft});
			}

			self.setOtherComponentsData({
				connectList:self.state.connectList,
				id:self.state.activeId
			});

		},20);
    },
    componentWillUnmount: function() {
        AppStoresForTimeline.removeChangeListener(this._onChange);
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
	getActiveIdNow:function(params) {
		if(!params || !params.nowTime) {
			return false;
		}
		var config = this.props.config;
		var activityId = config.activityId;
		var activityType = config.activityType;
		var activityId_activityType = lib.combine([activityId,activityType]);

		var nowTime = params.nowTime;
		var timeline =	entry[activityId_activityType] || [];
		var systemTimeLongTime = this.dateParse({date:nowTime});
		var activeId;

		for(var i=0;i<timeline.length;i++) {
			var startTime =  timeline[i] && timeline[i].onlineStartTime && this.dateParse({date:timeline[i].onlineStartTime});
			var endTime = timeline[i] && timeline[i].onlineEndTime && this.dateParse({date:timeline[i].onlineEndTime});
			if(timeline.length == 1) {
				if(systemTimeLongTime>endTime) {
					activeId = 'bigThanAll';
				}else if(systemTimeLongTime>=startTime) {
					activeId = i; 
					break;
				}else if(systemTimeLongTime<startTime) {
					activeId = 'smallThanAll';
				}				
			}else if(i==0) {
				if(systemTimeLongTime<startTime) {
					activeId = 'smallThanAll';
				}else {
					activeId = '0';
				}
			}else if(i==timeline.length-1) {
				if(systemTimeLongTime>endTime) {
					activeId = 'bigThanAll';
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
    	var activeId = this.getActiveIdNow({nowTime:window.serverTime})
    	if(activeId || activeId==0) {
			AppStoresForTimeline.data.activeId = activeId;
    	}
    	// console.log('onChangeActiveId',activeId);
    	if(AppStoresForTimeline.data.sourse == this.state.activityId_activityType+'_countdown') {
    		setTimeout(function(){
				self.setCountdownData();
    		},1);
    	}

    	console.log('resever run self',AppStoresForTimeline.data,'activeId',activeId,window.serverTime);
        this.setState(AppStoresForTimeline.data); 
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
    	AppActionsForTimeline.setTimeline({clickId:clickId,activeId:activeId,sourse:activityId_activityType+'_self'});
    },
    setOtherComponentsData:function(params) {
		var connectList = params.connectList;
		var id = params.id;
		if(id=='bigThanAll') {
			id = this.state.timeline && this.state.timeline.length-1 || '0';
		}else if(id=='smallThanAll'){
			id = '0'
		}
		for(var i=0;i<connectList.length;i++) {
			if(connectList[i].connectType == "BoomFoodItemList") {
				var params = {
					hotItem:connectList[i].data[id].data,
					activityId_activityType:connectList[i].activityId_activityType
				}
				AppActionsForBoomFoodItemList.setListData(params);
			}else if(connectList[i].connectType == "TuijianFood") {
				var params = {
					hotItem:connectList[i].data[id].data,
					activityId_activityType:connectList[i].activityId_activityType
				}
				AppActionsForTuijianFood.setTuijianListData(params);
			}else if(connectList[i].connectType == "PicTextMix720x380") {
				var params = {
					hotItem:connectList[i].data[id].data,
					activityId_activityType:connectList[i].activityId_activityType
				}
				AppActionsForPicTextMix720x380.setPicTextListData720x380(params);
			}else if(connectList[i].connectType == "PicTextMix650x650") {
				var params = {
					hotItem:connectList[i].data[id].data,
					activityId_activityType:connectList[i].activityId_activityType
				}
				AppActionsForPicTextMix650x650.setPicTextListData650x650(params);				
			}
		}
	},
	setCountdownData:function(params){
    	var config = this.props.config;
    	var activityId_activityType = this.state.activityId_activityType;
    	var connectList = this.state.connectList;
    	var timeline = this.state.timeline;
    	var clickId = params && params.clickId;
    	var activeId = this.state.activeId;
		if(!clickId && clickId!=0) {
			var params={
				activityId_activityType:activityId_activityType,
				connectList:connectList,
				timeline:timeline,
				clickId:null,
				activeId:activeId,
				systemTime:window.serverTime,
				onlineStartTime:timeline[activeId].onlineStartTime,
				onlineEndTime:timeline[activeId].onlineEndTime,
			}
			AppActionsForCountdown.setCountdown(params);
		}else {
			if(clickId<activeId) {
				var params = {
					activityId_activityType:activityId_activityType,
					connectList:connectList,
					timeline:timeline,
					clickId:clickId,
					activeId:activeId,
					systemTime:window.serverTime,
				}
				AppActionsForCountdown.setCountdown(params);
			}else {
				var params = {
					activityId_activityType:activityId_activityType,
					connectList:connectList,
					timeline:timeline,
					clickId:clickId,
					activeId:activeId,
					systemTime:window.serverTime,
					onlineStartTime:timeline[clickId].onlineStartTime,
					onlineEndTime:timeline[clickId].onlineEndTime,
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
    	var connectList = this.state.connectList;
    	var id = params.id;
    	this.setStoreState({id:id,clickId:id});
    	this.setOtherComponentsData({
			connectList:connectList,
			id:id
		});
    	var ev = params.ev;
    	var target = ev.target;

		var node = this.getNode({target:target,className:'timeline'});
		top = top || this.getTop(node);
		top && lib.changeScrollTop({distance:top});

		var clickId = id;

		this.setCountdownData({clickId:clickId})
    },
	render: function() {
		var self = this;
		var activeId = this.state.activeId;
		var clickId = this.state.clickId;
		var config = this.props.config;
		var templateChoose = window.templateChoose;
		var timelineT = templateChoose && templateChoose.timeline || {};
		var activityId_activityType = this.state.activityId_activityType;
		var connectList = this.state.connectList;
		var timeline = this.state.timeline;
		if(!timeline || timeline.length==0) {
			return(
				<div></div>
			)
		}else if(timeline.length<2) {
			return (
				<Sticky config={config} classSend="height90" id={activityId_activityType}>
					<Countdown activeId = {activeId} clickId = {clickId} activityId_activityType={activityId_activityType} connectList={connectList} timeline = {timeline} config = {config} template={timelineT.countdown} />
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
				<div className={className} data-id={i} onClick={function(ev){self.click({id:i,ev:ev})}}>
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
				<Countdown activityId_activityType={activityId_activityType} connectList={connectList} timeline = {timeline} activeId = {activeId} clickId={clickId} config = {config} template={timelineT.countdown} />
			</Sticky>
		)
	}

});

window.AppActionsForTimeline = AppActionsForTimeline;
module.exports = Timeline;
