/*
* 楼层
* 
*	
* 
*/
import style from './index.css';
var lib = require('lib/index.js');
var AppStoresForFloorNav = require('./store');
var AppActionsForFloorNav = require('./action');

var PAGE_OS = lib.navigator();
var Sticky = require('mixinComponents/Sticky/index');
var canScrollFunctionUse = true; //是否可以让window.scroll事件执行、

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
		var shouldSetModleId = this.props.shouldSetModleId;
		params.shouldSetModleId = shouldSetModleId;
		AppActionsForFloorNav.setFloorNav(params);
	},
	click:function(ev) {
		var target = ev.target;
		if(!target.className.match('floor-text')) {
			return ;
		}

		var id = target.getAttribute('data-id');
		var module = target.getAttribute('data-module');
		var moduleFirst =  module && module.split(',') && module.split(',')[0] && module.split(',')[0] +'maodian';
		var moduleFirstElement = document.getElementById(moduleFirst);
		var top = this.getTop(moduleFirstElement);
		canScrollFunctionUse = false;
		
		this.setActiveId({
			activeId:id
		});

		if((top || top == 0) && lib.changeScrollTop) {
			lib.changeScrollTop({distance:top,callback:function() {
				canScrollFunctionUse = true;
			}});
		}
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
					<div data-id={i} data-module={data.relevanceModule} className="floor-text floor-text-active">
						{data && data.name}
					</div>
				)
			} else {
				return (
					<div data-id={i} data-module={data.relevanceModule} className="floor-text">
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
var FloorNav = React.createClass({
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
		var shouldSetModleId = this.state.shouldSetModleId;
		params.shouldSetModleId = shouldSetModleId;
		AppActionsForFloorNav.setFloorNav(params);
	},
	getTop:function(e) {
	    var offset=e.offsetTop;
	    if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent);
	    return offset;
	},
	click:function(ev) {
		var config = this.props.config;
		var target  = ev.target;
		var id = target.getAttribute('data-id');
		var module = target.getAttribute('data-module');
		var moduleFirst =  module && module.split(',') && module.split(',')[0] + 'maodian';
		var moduleFirstElement = document.getElementById(moduleFirst);
		var top = this.getTop(moduleFirstElement);

		if(!target.className.match("type")) {
			return;
		}

		this.setActiveId({
			activeId:id
		});

		canScrollFunctionUse = false;
		(top || top == 0) && lib.changeScrollTop && lib.changeScrollTop({distance:top,callback:function() {
			canScrollFunctionUse = true;
		}});
	},
	isInWindow:function(params) {
		var self = this;
		var length = params.length;
		var i = params.i;
		var element = params.element;
		
		//传统方式
		var fontSize = document.documentElement.style.fontSize;
		var parseFontSize = parseInt(fontSize);
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		var elementTop = this.getTop(element);

		if(PAGE_OS.isApp) {
			if(lib.getByUrl('tspBar') == 'true') {
				if(PAGE_OS.isIOS) {
					var limit = (144/75)*parseFontSize;
				} else {
					var limit = (108/75)*parseFontSize;
				}
			} else {
				var limit = (20/75)*parseFontSize;
			}
		} else {
			var limit = (20/75)*parseFontSize;
		}
		if(elementTop-scrollTop<limit) {
			this.setActiveId({activeId:i});
		}

		/*通过getBoundingClientRect*/
		// var top = element.getBoundingClientRect().top
		// console.log(i,top,element);
		// if(top<=0){
		// 	this.setActiveId({activeId:i});
		// }
	},
	scrollListener:function(params) {
		if(!canScrollFunctionUse) {
			return;
		}
		var length = params.length;
		for(var i=0;i<params.length;i++) {
			this.isInWindow({
				i:i,
				element:params[i],
				length:length
			});
		}
	},
	getInitialState:function() {
		var config = this.props.config;
		var list = config && config.list || [];
		var moduleId = config && config.moduleId;
		var shouldSetModleId = list && list[0] && list[0].relevanceModule;
		var activityId_activityType = moduleId;
		return {
			navList:list,
			activeId:0,
			shouldSetModleId:shouldSetModleId,
			moduleId:moduleId,
			activityId_activityType:activityId_activityType
		}
    },
    componentDidMount: function() {
		AppStoresForFloorNav.addChangeListener(this._onChange);
		var moduleId = this.state.modleId;
		var fastNode = document.getElementById(moduleId);
		if(fastNode) {
			var fast = SGLib.FastClick(fastNode);
		}

		var self = this;
		var list = this.state.navList;
		var modulePush = [];
		for(var i=0;i<list.length;i++) {
			var shouldSetModleId = list[i].relevanceModule;
			if(i==list.length-1) {
				var splitModleId = shouldSetModleId && shouldSetModleId.split(',');
				var len = splitModleId && splitModleId.length && splitModleId.length-1 || 0;
				var modleId = splitModleId && splitModleId[len] && splitModleId[len]+'maodian';
				var element = document.getElementById(modleId);
				modulePush.push(element);
			} else {
				var splitModleId = shouldSetModleId && shouldSetModleId.split(',') && shouldSetModleId.split(',')[0] && shouldSetModleId.split(',')[0]+'maodian';
				var element = document.getElementById(splitModleId);
				modulePush.push(element);
			}
		}

		window.addEventListener('scroll',function() {
			lib.throttle(function(){
				self.scrollListener(modulePush);
			})();
		},false);
	},
    componentWillUnmount: function() {
        AppStoresForFloorNav.removeChangeListener(this._onChange);
    },
    _onChange: function() {
    	var list = this.state.navList;
    	for(var i=0;i<list.length;i++) {
    		if(list[i].relevanceModule.indexOf(AppStoresForFloorNav.data.shouldSetModleId)!=-1) {
    			this.setState(AppStoresForFloorNav.data);
    			break;
    		}
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
	render: function() {
		var self = this;
		var navList = this.state.navList ;
		var navListLength = navList && navList.length;
		var morethanfour = navListLength && navListLength>3;
		var config = this.props.config;
		var activeId = this.state.activeId ;
		var templateChoose = window.templateChoose;
		var navigation = templateChoose && templateChoose.navigation || {};
		var activityId_activityType = this.state.activityId_activityType;
		var modleId = this.state.modleId;
		if(!navList || !navList.length) {
			return (
				<div></div>
			)
		}
		
		if(!navListLength || navListLength==0) {
			return (
				<div>
				</div>
			)
		}else if(navListLength<3) {
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
					<div data-id={i} data-module={data.relevanceModule} className="type type-active" style={widthL}>
						{data && data.name}
					</div>
				)
			} else {
				return (
					<div data-id={i} data-module={data.relevanceModule} className="type" style={widthL}>
						{data && data.name}
					</div>
				)
			}
		});

		sty.backgroundColor = navigation.backgroundColor;

		return (
				<Sticky config={config} id={modleId}>
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
					<ChangeFloor navList = {navList} config={config} activeId={activeId} activityId_activityType={activityId_activityType} shouldSetModleId={this.state.shouldSetModleId} />
				</Sticky>
		);
	}

});
//包裹的元素，里面滚动的元素
window.AppActionsForFloorNav = AppActionsForFloorNav;
module.exports = FloorNav;
