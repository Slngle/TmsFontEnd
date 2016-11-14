import style from './index.css';
var lib = require('lib/index.js');
var PAGE_OS = lib.navigator();
window.scrollTopJson = window.scrollTopJson?scrollTopJson : {};
//Sticky的元素
var Sticky = React.createClass({
	componentDidMount: function() {
		var self = this;

		//fastclick
		var moduleId = this.props.id;
		var fastNode = document.getElementById(moduleId);
		if(fastNode) {
			var fast = SGLib.FastClick(fastNode);
		}

		if(PAGE_OS.isAndroid) {
			window.addEventListener('scroll',function() {
				lib.throttle(self.navPos,100)();
			},false);
		}
		setTimeout(function(){
			self.orientate();
		},2000);
		
	},
	orientate:function() {
		var config = this.props.config;
		var activityId = config.activityId;
		var activityType = config.activityType;
		var activityId_activityType = lib.combine([activityId,activityType]);
		var sticky = this.refs.sticky.getDOMNode();
		var top = this.getTop(sticky);
		scrollTopJson[activityId_activityType] = top;
	},
	getTop:function(e) {
	    var offset=e.offsetTop;
	    if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent);
	    return offset;
	},
	navPos:function() {
		var element = document.querySelectorAll('.webkit-sticky');
		var soldlisttitleWrapPos = document.querySelectorAll('.webkit-sticky-fixed-wrap');
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		for(var i=0;i<element.length;i++) {
			var top = element[i].getBoundingClientRect().top;
			if(top < 0 || top == 0) {
	            soldlisttitleWrapPos[i].classList.add('nav-in-active');
	        }
	        else if(top > 0 ) {
	            soldlisttitleWrapPos[i].classList.remove('nav-in-active');
	        }   
		}
	},
	checkInApp:function() {
		var tspBar = lib.getByUrl("tspBar");
		
	    //判断是否在app里 没有的话不能把top设置大
	    if(tspBar == 'true') {
	        if(PAGE_OS.isAndroid && !PAGE_OS.isApp) {
	          	return "android";
	        } else if(PAGE_OS.isIOS && !PAGE_OS.isApp) {
	          	return "ios";
	        }
	        return true;
	    } else {
	        if(PAGE_OS.isAndroid) {
	          	return "android";
	        } else if(PAGE_OS.isIOS) {
	          	return "ios";
	        }
	        return "";
	    }
	},
	render: function() {
		var style1 = this.props.style || {}
		var heightClass = this.props.classSend || '';
		var config = this.props.config || {};
		var hidden = config.hidden;
		var style2 = {};
		var id = this.props.id;
		if(this.checkInApp() == 'ios') {
			style1.top = '0';
		}else if(this.checkInApp() == 'android') {
			style2.top = '0';
		}

		if(hidden) {
			style1.display = 'none';
		}

		if(heightClass) {
			var className = "webkit-sticky " +heightClass;
		}else {
			var className = "webkit-sticky";
		}

		return (
			<div className={className} ref='sticky' style = {style1} id={id}>
				<div className="webkit-sticky-fixed-wrap" style = {style2}>
					{this.props.children}
				</div>
			</div>
		);
	}

});
//Sticky的元素

module.exports = Sticky; 
