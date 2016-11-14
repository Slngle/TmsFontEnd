/*
* other 为html 可在其里面添加
* imgUrl 为图片地址
* imgLink 为跳转链接地址
*/

import style from './index.css';

var Img = require("mixinComponents/Img/index");
var lib = require('lib/index');
var PAGE_OS = lib.navigator();

var Banner = React.createClass({
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
		var config = this.props.config
		var hidden = config && config.hidden;
		var moduleId = config && config.moduleId;
		var banner = config;
		var getRightClassName = this.getRightClassName();
		var ConfigSize = banner && banner.size && banner.size.split('x');
		var widthPic = config && config.width && config.width/75 + 'rem';
		var heightPic = config && config.height && config.height/75 + 'rem';

		var widthConfig = config && config.width;
		var heightConfig = config && config.height;
		var size = widthConfig +'x'+heightConfig;
		if(banner && banner.other) {
			var other = <div className="other"  dangerouslySetInnerHTML={{__html: banner.other}}></div>;
		} else {
			var other = <div className="other" ></div>;
		}

		if(hidden) {
			var display = 'none';

		}else {
			var display = 'block';
		}

		return (
			<div className="banner-wrap" id={moduleId} style={{width:widthPic,height:heightPic,display:display}}>
				<div className={getRightClassName} id={moduleId+'maodian'}></div>
				<Img size={size} src={banner && banner.src} link={banner && banner.link} rname="top-banner"/>
				{other}
			</div>
		)
	}

});

module.exports = Banner;