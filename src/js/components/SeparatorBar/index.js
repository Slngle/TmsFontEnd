import style from './index.css';
var lib = require('lib/index');
var PAGE_OS = lib.navigator();
var SeparatorBar = React.createClass({
	getRightClassName:function() {
		if(PAGE_OS.isApp) {
			if(lib.getByUrl('tspBar')=='true') {
	 		if(PAGE_OS.isIOS) {
					return "iosPos";
				} else {
					return "androidPos";
				}
			}else {
				return "normal-posdiv";
			}
		} else {
			return "normal-posdiv";
		}
	},
	render: function() {
		var config = this.props.config || {};
		var hidden = config.hidden;
		var moduleId = config.moduleId;
		var align = config.align || 'left';
		var bgUrl = config.bgUrl;
		var width = config && config.width && config.width/75 + 'rem';
		var height = config && config.height && config.height/75 + 'rem';
		var connect = config.connect || [];
		var haveData = false;
		for(var i=0;i<connect.length;i++) {
			var relevanceData = connect[i].relevanceData
			var data = relevanceData && entry[relevanceData];
			if(data && data.length) {
				haveData = true;
			}
		}
		var getRightClassName = this.getRightClassName();
		var templateChoose = window.templateChoose;
		var separatorBar = templateChoose && templateChoose.separatorBar || {};

		//宽度高度背景图url
		//关联的数据
		if(bgUrl) {
			bgUrl = "url(" + bgUrl + ")";
		}else {
			bgUrl = "none";
		}

		if(hidden) {
			var display = 'none'
		}else {
			var display = 'block'
		}

		if(!haveData) {
			return (
				<div></div>
			)
		}else {
			return (
				<div className="SeparatorBar" id={moduleId} style={{"textAlign":align,"color":separatorBar.color,"width":width,"height":height,backgroundImage:bgUrl,"display":display}}>
					<div className={getRightClassName} id={moduleId+'maodian'}></div>
					{config.text}
				</div>
			);				
		}	
	}

});

module.exports = SeparatorBar;