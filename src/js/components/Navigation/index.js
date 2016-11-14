import style from './index.css';
var AppStoresForNavigation = require('./store');
var AppActionsForNavigation = require('./action');
var lib = require('lib/index.js');
var PAGE_OS = lib.navigator();
var Sticky = require('mixinComponents/Sticky/index');
//浮层
var ChangeFloor = React.createClass({
	close:function() {
		var ele = this.refs.wrap.getDOMNode();
		ele.classList.add('hidden');
	},
	getTopClass:function() {
		var tspBar = lib.getByUrl("tspBar");
	    if(tspBar == 'true') {
	    	if(!PAGE_OS.isApp) {
	    		return 'normal-top';
	    	}else if(PAGE_OS.isAndroid && PAGE_OS.isApp) {
	          	return "android-top";
	        } else if(PAGE_OS.isIOS && PAGE_OS.isApp) {
	          	return "ios-top";
	        }
	    } else {
	    	return 'normal-top';
	    }
	},
	getTop:function(e) {
	    var offset=e.offsetTop;
	    if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent);
	    return offset;
	},
	setActiveId:function(params) {
		var activityId_activityType = this.props.activityId_activityType;
		params.activityId_activityType = activityId_activityType;
		AppActionsForNavigation.setNavGation(params);
	},
	click:function(ev) {
		var target = ev.target;
		if(!target.className.match('floor-text')) {
			return ;
		}
		var id = target.getAttribute('data-id');
		this.props.setOtherComponentsData({
			connectList:this.props.connectList,
			id:id
		});
		this.setActiveId({activeId:id});
	},
	touchMove:function(e) {
		e.preventDefault();
	},
	render: function() {
		var self = this;
		var navList = this.props.navList;
		var activeId = this.props.activeId;
		var className = this.getTopClass();
		var floorname = navList.map(function(data,i) {
			if(i == activeId) {
				return (
					<div data-id={i} className="floor-text floor-text-active">
						{data && data.name}
					</div>
				)
			} else {
				return (
					<div data-id={i} className="floor-text">
						{data && data.name}
					</div>
				)
			}

		});
		return (
			<div className="changeFloor hidden" ref='wrap' onClick={this.close} onTouchMove = {function(e){self.touchMove(e)}}>
				<div className={className + " changeFloor-wrap"}>
					<div className="change-qie">
						<p className="qie-text">切换楼层</p>
						<div className="jiantou">
							
						</div>
					</div>
					<div className="floor-name">
						<div className="floor-name-wrap clear" onClick={function(ev){self.click(ev)}}>
							{floorname}
						</div>
					</div>
				</div>
			</div>
		);
	}

});
//浮层

//包裹的元素，里面滚动的元素
var widthList = (function(){
	var html = document.getElementsByTagName('html')[0];
	var attr = html && html.getAttribute('data-dpr');
	if(attr==1) {
		return 52;
	}else if (attr==2) {
		return 104;
	}else if(attr==3) {
		return 156;
	}
})();

var timerFloor = null;
var Navigation = React.createClass({
	showFloat:function() {
		var PAGE_OS = lib.navigator();
		var changeFloor = document.querySelector('.changeFloor');
		var tspBar = lib.getByUrl("tspBar");
		changeFloor && changeFloor.classList && changeFloor.classList.remove("hidden");
		if(PAGE_OS.isApp && tspBar==true){
			setTimeout(function(){
				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				if(window.dpr == 1) {
					var top = 250;
				}else if(window.dpr == 2) {
					var top = 500;
				}else {
					var top = 750;
				}
				if(scrollTop<top) {
					document.documentElement.scrollTop = top;
					document.body.scrollTop = top;	
				}
			},30);
		}
	},
	setActiveId:function(params) {
		var activityId_activityType = this.state.activityId_activityType;
		params.activityId_activityType = activityId_activityType;
		AppActionsForNavigation.setNavGation(params);
	},
	getTop:function(e) {
	    var offset=e.offsetTop;
	    if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent);
	    return offset;
	},
	setOtherComponentsData:function(params) {
		var connectList = params.connectList;
		var id = params.id;
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
	click:function(ev) {
		var connectList = this.state.connectList;
		var config = this.props.config;
		var activityId_activityType = this.state.activityId_activityType;
		var target  = ev.target;
		var id = target.getAttribute('data-id');
		if(!target.className.match("type")) {
			return;
		}
		
		var top = scrollTopJson[activityId_activityType];

		this.setOtherComponentsData({
			connectList:connectList,
			id:id
		})
		top && lib.changeScrollTop && lib.changeScrollTop({distance:top+10,callback:function(){
		}});
		this.setActiveId({activeId:id});


	},
	getInitialState:function() {
		var config = this.props.config;
		var activityId = config.activityId;
		var activityType = config.activityType;

		var activityId_activityType = activityId && activityType && lib.combine([activityId,activityType]);
		var activeId = 0;
		var connect = config.connect;
		var connectList = [];

		for(var i=0;i<connect.length;i++) {
			connectList.push({
				activityId_activityType:connect[i].relevanceData,
				connectType:connect[i].relevanceModule,
				data:entry[connect[i].relevanceData]
			});
		}
		var navList = entry[activityId_activityType];
		if(navList && navList.length) {
			return {
				navList:navList,
				connectList:connectList,
				activeId:activeId,
				activityId_activityType:activityId_activityType
			}
		}else {
			return {
				navList:[],
				connectList:[],
				activeId:'',
				activityId_activityType:activityId_activityType
			}
		}
    },
	componentDidMount: function() {
		AppStoresForNavigation.addChangeListener(this._onChange);
	},
    componentWillUnmount: function() {
        AppStoresForNavigation.removeChangeListener(this._onChange);
    },
    _onChange: function() {
    	var activityId_activityType = this.state.activityId_activityType ;
    	
    	if(activityId_activityType == AppStoresForNavigation.data.activityId_activityType) {
    		this.setState(AppStoresForNavigation.data);
    	}
        
    },
	componentDidUpdate: function(prevProps, prevState) {
		setTimeout(function() {
			var comStickyWrap = document.querySelector('.flex1 .com-sticky-wrap');
			var activeType = document.querySelector('.type-active'); 
			//comStickyWrap.scrollLeft = activeType.offsetLeft + activeType.offsetWidth - comStickyWrap.offsetWidth + widthList;
			if(activeType) {
				var comStickyWrapScrollLeft = activeType.offsetLeft + activeType.offsetWidth - comStickyWrap.offsetWidth + 2*widthList;
				lib.moveFn(comStickyWrap,{scrollLeft:comStickyWrapScrollLeft});
			}
		},20);
	},
	getAllFoodLength:function(params) {
		var connectList = params.connectList;
		var length = 0;
		for(var i=0;i<connectList.length;i++) {
			length+=connectList[i].data[0].data.length;
		}
		return length;
	},
	render: function() {
		var self = this;
		var navList = this.state.navList ;
		var navListLength = navList && navList.length;
		var morethanfour = navListLength && navListLength>3;
		var config = this.props.config;
		var activeId = this.state.activeId ;
		var connectList = this.state.connectList;
		var allFoodLength = 20;//this.getAllFoodLength({connectList:connectList});
		var templateChoose = window.templateChoose;
		var navigation = templateChoose && templateChoose.navigation || {};
		var activityId_activityType = this.state.activityId_activityType;
		if(!navList || !navList.length) {
			return (
				<div></div>
			)
		}
		
		if(allFoodLength <= 0) {
			return (
				<div>
				</div>
			)
		}else if(!navListLength || navListLength==0) {
			return (
				<div>
				</div>
			)
		}else if(navListLength<3 || allFoodLength<20) {
			return (
				<div className="noMoreThan3">
					<div className="allFoodTitleline"></div>
					<div className="allFoodTitle">全部商品</div>
					<div className="allFoodTitleline"></div>
				</div>
			)
		}

		if(morethanfour) {
				var btn = <div className="right-btn" onClick={this.showFloat}>
							<div className="right-btn-shadow" style={{backgroundImage:navigation.shadow}}></div>
							<div className="right-btn-btn" style={{backgroundColor:navigation.backgroundColor}}></div>
						  </div>;
				var sty = {};
				var widthL = {}
		}else {
			var btn = <div></div>;
			var sty = {paddingRight:0};
			var widthL = {width:"33%"}  
		}

		var list = navList.map(function(data,i) {
			if(i == activeId) {
				return (
					<div data-id={i} className="type type-active" style={widthL}>
						{data && data.name}
					</div>
				)
			} else {
				return (
					<div data-id={i} className="type" style={widthL}>
						{data && data.name}
					</div>
				)
			}
		});

		sty.backgroundColor = navigation.backgroundColor;

		return (
				<Sticky config={config}>
					<div className="webkit-sticky-relative-wrap" style={sty}>
						<div className="flex1">
							<div className="com-sticky-wrap">
								<div className="com-sticky-wrap-webkit" onClick={function(ev){self.click(ev)}}>
									{list}
								</div>
							</div>
						</div>
						{btn}
					</div>
					<ChangeFloor navList = {navList} config={config} activeId={activeId} activityId_activityType={activityId_activityType} connectList={connectList} setOtherComponentsData={self.setOtherComponentsData}/>
				</Sticky>
		);
	}

});
//包裹的元素，里面滚动的元素

window.AppActionsForNavigation = AppActionsForNavigation;
module.exports = Navigation;
