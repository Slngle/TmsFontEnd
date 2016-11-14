import style from './index.css';
var windowLib = window.lib;
var lib = require('lib/index');

var jsonPrefix = lib.returnHost();
var timer = null;
var PAGE_OS = lib.navigator();

var RedEnvelope = React.createClass({
	componentDidMount:function() {
        var IOSDownload = lib.getByUrl('IOSDownload',this.props.imgUrl);
        if(window.location.hash.match('download') && !PAGE_OS.isAndroid && !PAGE_OS.isInWechat) {
			window.location.href = IOSDownload;
        }
        var config = this.props.config;
        var moduleId = config && config.moduleId
        var fastNode = document.getElementById(moduleId);
		if(fastNode) {
			var fast = SGLib.FastClick(fastNode);
		}

		var open_id = lib.randomData(10) + new Date().getTime();
		var config = this.props.config || {};
		var hongbaoCode = config.hongbaoCode;
		windowLib.ajax({
			url: 'http://flume.52shangou.com:18080/' + 'http://www.52shangou.com?open_id=' + open_id + '&spm=' +hongbaoCode+'gogoing',
			data: null,
			dataType: 'jsonp',
			success: function(data) {

			},
			error:function() {

			}
	    });

    },
	touchmove:function(e) {
		e.preventDefault();
	},
	download:function(params) {

		var IOSDownload = params && params.IOSDownload;
		var AndroidDownload = params && params.AndroidDownload;
		var hongbaoCode = params.hongbaoCode
		var input = React.findDOMNode(this.refs.input);
		var open_id = lib.randomData(10) + "" + new Date().getTime();
		var spmCode = hongbaoCode + 'download';

		windowLib.ajax({
			url: 'http://flume.52shangou.com:18080/' + 'http://www.52shangou.com?phone=' + input.value + '&open_id=' + open_id + '&spm=' + spmCode,
			data: null,
			dataType: 'jsonp',
			success: function(data) {

			},
			error:function() {

			}
	    });

	    clearTimeout(timer);
 		timer = setTimeout(function() {
 			if(PAGE_OS.isAndroid){
 				window.location.href=AndroidDownload;
 			}else {
 				if(PAGE_OS.isInWechat) {
 					AppActions.setToast({
						type:'alert',
						style:{display:"-webkit-box"},
						content:'请点击右上角，选择用浏览器打开,即可下载app~'
					});
					window.location.hash = 'download';
 					return;
 				}

				window.location.href = IOSDownload;
 			}
 		},1000);
	},
	requestActivityCode:function(params) {
		var input = React.findDOMNode(this.refs.input);
		var success = React.findDOMNode(this.refs.success);
		var btn = React.findDOMNode(this.refs.btn);
		var download = React.findDOMNode(this.refs.download);
		windowLib.ajax({
			url:jsonPrefix + params.url,
			dataType:'jsonp',
			data:{
				hongbaoCode:params.data.hongbaoCode,
				open_id:params.data.open_id,
				phone:input.value
			},
			success:function(data) {
				if(data && data.status == true) {	
					success.classList.remove('hidden');
					download.classList.remove('hidden');

					input.classList.add('hidden');
					success.innerHTML = '红包已放入 ' + input.value;
					btn.classList.add('hidden');

					windowLib.ajax({
						url: 'http://flume.52shangou.com:18080/' + 'http://www.52shangou.com?phone=' + input.value + '&open_id=' + params.data.open_id + '&spm=' +params.data.hongbaoCode,
						data: null,
						dataType: 'jsonp',
						success: function(data) {

						},
						error:function(){

						}
				    });
				}else {
					if(data && data.responseCode == -2) {
						success.classList.remove('hidden');
		    			download.classList.remove('hidden');

		    			input.classList.add('hidden');
		    			success.innerHTML = '你已经领过啦';
		    			btn.classList.add('hidden');
					}else if(data && data.responseCode == -1) {
						AppActionsForToast.setToast({
							type:'alert',
							style:{display:"-webkit-box"},
							content:'活动已过期！'
						});
					}else if(data && data.responseCode == -3) {
						AppActionsForToast.setToast({
							type:'alert',
							style:{display:"-webkit-box"},
							content:'此活动只限新用户！'
						});
					}else if(data && data.responseCode == -4) {
						AppActionsForToast.setToast({
							type:'alert',
							style:{display:"-webkit-box"},
							content:'红包已领完！'
						});
					}else {
						var message = data && data.message || '领取失败';
						AppActionsForToast.setToast({
							type:'alert',
							style:{display:"-webkit-box"},
							content:message
						});
					}
				}
			}
		});
	},
	request:function(params) {
		var input = React.findDOMNode(this.refs.input);
		var success = React.findDOMNode(this.refs.success);
		var btn = React.findDOMNode(this.refs.btn);
		var download = React.findDOMNode(this.refs.download);
		var self = this;
		var re = /^1\d{10}$/g;
		var hongbaoCode = params.hongbaoCode;
		var open_id = lib.randomData(10) + "" + new Date().getTime();
		if(!re.test(input.value)) {
			AppActionsForToast.setRightWrong({
				havePic:'wrong',
				content:'手机号错误'
			});
			return;
		}

		if(!hongbaoCode) {
			AppActionsForToast.setRightWrong({
				havePic:'wrong',
				content:'运营未填写红包code'
			});
			return;
		}

		self.requestActivityCode({
			url:'/market/api/hongbao/sendHongbaoByHongbaoCode.jsonp',
			data:{
				hongbaoCode:hongbaoCode,
				open_id:open_id,
			}
		});
	},
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
		var self = this;
		var config = this.props.config;
		var moduleId = config.moduleId;
	    var ruleArr = config && config.ruleArr && config.ruleArr.split(';');
		var bgColor = config && config.bgColor && {backgroundColor:config.bgColor};
		var IOSDownload = config && config.IOSDownload || 'http://a.app.qq.com/o/simple.jsp?pkgname=com.redcat.shandiangou';
		var AndroidDownload = config && config.AndroidDownload || 'http://a.app.qq.com/o/simple.jsp?pkgname=com.redcat.shandiangou';
		var hongbaoCode = config && config.hongbaoCode;
		var isColorLight = config && config.isColorLight || '1';
		var getRightClassName = this.getRightClassName();
		var hidden = this.props.hidden;


		if(hidden) {
			var strHidden = {
				display:'none'
			}
		}else {
			var strHidden = {
			}	
		}

		if(isColorLight == '1') {
			var colorJson = {};
		}else {
			var colorJson = {
				topBorderColorBefore:'1px solid #ffffff',
				topColorBefore:'#ffffff',
				bottomBorderColorBefore:'1px inset #333333',
				bottomBackgroundBefore:'#FFE500',
				bottomColorBefore:'#333333',
				topBorderColorAfter:'1px solid #ffffff',
				topColorAfter:'#ffffff',
				bottomBackgroundAfter:'#FF2B00',
				ruleColor:'#ffffff'
			};
		}

		//领取前顶部的边框颜色
		var topBorderColorBefore = colorJson.topBorderColorBefore || '1px solid #333333';
		//领取前顶部的字体颜色
		var topColorBefore = colorJson.topColorBefore || '#988A1A';
		//领取前立即领取的边框颜色
		var bottomBorderColorBefore = colorJson.bottomBorderColorBefore || '1px solid #333333';
		//领取前立即领取的背景颜色
		var bottomBackgroundBefore = colorJson.bottomBackgroundBefore || '';
		//领取前立即领取的字体颜色
		var bottomColorBefore = colorJson.bottomColorBefore || "#000";


		//领取后顶部边框颜色
		var topBorderColorAfter = colorJson.topBorderColorAfter || '1px solid #333333';
		//领取后顶部的字体颜色
		var topColorAfter = colorJson.topColorAfter || '#988A1A';		
		//领取后立即领取的边框颜色
		var bottomBorderColorAfter = colorJson.bottomBorderColorAfter || '1px solid #ff2b00';
		//领取后立即领取的背景颜色
		var bottomBackgroundAfter = colorJson.bottomBackgroundAfter || '#ff2b00';
		//领取后立即领取的字体颜色
		var bottomColorAfter = colorJson.bottomColorAfter || "#ffffff";

		//规则的颜色
		var ruleColor = colorJson.ruleColor || "#333333";




		var styleTopBefore = {};
		styleTopBefore.border = topBorderColorBefore;
		styleTopBefore.color = topColorBefore;

		var styleBottomBefore = {};
		styleBottomBefore.border = bottomBorderColorBefore;
		styleBottomBefore.backgroundColor = bottomBackgroundBefore;
		styleBottomBefore.color = bottomColorBefore;

		var styleTopAfter = {};
		styleTopAfter.border = topBorderColorAfter;
		styleTopAfter.color = topColorAfter;

		var styleBottomAfter = {};
		styleBottomAfter.border = bottomBorderColorAfter;
		styleBottomAfter.backgroundColor = bottomBackgroundAfter;
		styleBottomAfter.color = bottomColorAfter;

		var styleRuleColor = {};
		styleRuleColor.color = ruleColor;

		if(topColorBefore) {
			var styleDom = document.createElement('style');
			styleDom.innerHTML = 'input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {color: '+topColorBefore+';}';
			document.body.appendChild(styleDom);			
		}

		
		if(ruleArr && ruleArr.length) {
			var pList = ruleArr.map(function(data) {
				return (
					<p>{data}</p>
				)
			});	
		}else {
			var pList = <p></p>;
		}


		return (
			<div className = "redEnvelopeOnly" onTouchMove={this.touchmove} style={strHidden} id={moduleId}>
				<div className={getRightClassName} id={moduleId+'maodian'}></div>
				<div className="phone">
					<div className="input">
						<input ref = 'input' type="tel" placeholder="输入手机号" style={styleTopBefore}/>
						<div ref = 'success' className="response hidden" style={styleTopAfter}></div>
					</div>
					
					<div className="btn" ref = 'btn' onClick = {function(){self.request({hongbaoCode:hongbaoCode})}} style={styleBottomBefore}>
						立即领取
					</div>

					<div ref='download' style={styleBottomAfter} onClick={function(){self.download({IOSDownload:IOSDownload,AndroidDownload:AndroidDownload,hongbaoCode:hongbaoCode})}} className="download hidden">
						下载闪电购
					</div>

					<div className="rulebottom">
						{pList}
					</div>
				</div>
			</div>
		);
	}

});

module.exports = RedEnvelope;