import style from './index.css';
var Img = require("mixinComponents/Img/index");
var lib = require("lib/index");
var windowLib = window.lib;
var HotPoint = React.createClass({
	componentDidMount: function() {
		window.img && img.fireLazyload();
		var spm = lib.getByUrl('spm');
		var open_id = lib.randomData();
		if(spm) {
			windowLib.ajax({
				url: 'http://flume.52shangou.com:18080/' + 'http://www.52shangou.com?open_id=' + open_id + '&spm=' + spm,
				data: null,
				dataType: 'jsonp',
				success: function(data) {

				},
				error:function() {

				}
		    });
		}
	},
	linkClick:function(link) {
		if(link) {
			var spm = lib.getByUrl('spm',link);
			var open_id = lib.randomData();
			if(spm) {
				windowLib.ajax({
					url: 'http://flume.52shangou.com:18080/' + 'http://www.52shangou.com?open_id=' + open_id + '&spm=' + spm + 'click',
					data: null,
					dataType: 'jsonp',
					success: function(data) {

					},
					error:function() {

					}
			    });
			}

			setTimeout(function() {
				window.location.href = link;			
			},1500);
		}else {
			alert('无链接地址');
		}

	},
	render: function() {
		var config = this.props.config;
		var self = this;
		var data = config && config.data || {};
		var ImgList = data.ImgList || [];
		var linkList = data.linkList || {};
		var cell = data.cell || '680';
		var imgListRender = ImgList.map(function(data) {
			return (
				<Img src={data} rname="imgList" size="750x340" />
			)
		});
      
      	var aListNew = []
		for(var i in linkList) {
          if (linkList.hasOwnProperty(i)) {
          	aListNew.push(linkList[i]);
          }
        }
      	
		var aList = aListNew.map(function(data) {
			var style = {};
			var left = data && data.pos && data.pos.left;
			var height = data && data.pos && data.pos.height;
			var top = data && data.pos && data.pos.top;
			var width = data && data.pos && data.pos.width;

			style.left = left*2/75 +'rem';
			style.height = height*2/75 +'rem';
			style.top = top*2/75 +'rem';
			style.width = width*2/75 +'rem';

			return (
				<div className="link-abs" data-href = {data.link} style={style} onClick={function(){
					self.linkClick(data.link)
				}}></div>
			)
		});

		return (
			<div className="HotPoint">
				{imgListRender}
				<div className="link">
				{aList}
				</div>
			</div>
		);
	}

});

module.exports = HotPoint;