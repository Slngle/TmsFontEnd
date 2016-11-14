/*
* 优惠券模板
* config为array 里面有{hongbaoSetId：‘红包id’，coupon：‘优惠信息 如 免邮 5元优惠券’，
*	base：‘优惠条件，如满30才可以使用’，timeLimit：‘限制时间 如2016年4月前使用’}
* 
*/

import style from './index.css';
var lib = require('lib/index.js');
var windowLib = window.lib;
var loginUrl = 'buyer/personalcenter/php/o2o/login/login_in_app.html?page=new-app-page&spm=a_shandiangou.b_special_two.c_.d_';
var PAGE_OS = lib.navigator();
var Coupon = React.createClass({
	getInitialState: function() {
		var config = this.props.config;

		return {
			data:[],
			moduleId:config.moduleId,
			hidden:config.hidden
		};
	},
	query:function(params) {
		var hongbaoSetId = params.hongbaoSetId;
		window.lib.ajax({
			url:lib.returnHost()+'/market/api/hongbao/sendHongbao.jsonp',
			data:{
				hongbaoSetId:hongbaoSetId
			},
			dataType:'jsonp',
			success:function(data) {
				var message = data && data.message;
				if(data && data.status && data.responseCode == 0) {
					AppActionsForToast.setRightWrong({
						havePic:'right',
						content:'领取成功！'
					});
				}else if(data && data.responseCode == -1) {
					window.location.href = lib.returnHost()+loginUrl;
				}else {
					AppActionsForToast.setRightWrong({
						havePic:'wrong',
						content:message
					});
				}
			},
			error:function(data) {
				AppActionsForToast.setRightWrong({
					havePic:'right',
					content:'网络异常！'
				});
			}
		})
	},
	componentDidMount: function() {
		var self = this;
		var configProps = this.props.config;
		
        var moduleId = configProps && configProps.moduleId
        var fastNode = document.getElementById(moduleId);
		if(fastNode) {
			var fast = SGLib.FastClick(fastNode);
		}

		if(!configProps || !configProps.hongbaoSetId) {
			return;
		}



		windowLib.ajax({
			url:lib.returnHost()+'/market/api/tms/hongbaoList.jsonp',
			data:{
				"hongbaoIds":configProps.hongbaoSetId,
			},
			dataType:'jsonp',
			success:function(data){
				if(data && data.status==true && data.responseCode == 0) {
					if(data.entry && data.entry.hongbao && data.entry.hongbao.length) {
						self.setState({
							data:data.entry.hongbao,
							moduleId:configProps.moduleId,
							hidden:configProps.hidden
						})
					}
				}
			},
			error:function(data) {
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
		var hongbaoData = this.state.data;
		var re = /\d+/g;
		var templateChoose = window.templateChoose;
		var coupon = templateChoose && templateChoose.coupon || {};
		var hidden = this.state.hidden;
		var moduleId = this.state.moduleId;
		var getRightClassName = this.getRightClassName();

		if(hidden) {
			var style = {
				display:"hidden"
			}
		}else {
			var style = {}
		}

		if(!this.state.data || this.state.data.length == 0) {
			return (
				<div className="Coupon-wrap" id={moduleId} style={style}>
				</div>
			);
		}

		if(!hongbaoData || hongbaoData.length == 0) {
			return (
				<div className="Coupon-wrap" id={moduleId} style={style}>
				</div>
			)
		}

		if(hongbaoData.length == 1) {
			var stylebg = {
				"backgroundImage":"url(" + coupon.backgroundLong + ")"
			}
		}else {
			var stylebg = {
				"backgroundImage":"url(" + coupon.backgroundImageShort + ")"
			}
		}

		var list = hongbaoData.map(function(data,i) {
			if(i==1) {
				var className="mlleft list-contain"
			}else {
				var className="list-contain"
			}
			return (
				<div className={className} style={stylebg} onClick={function(){self.query({hongbaoSetId:data.id})}}>
					<div className="couponrule">
						{data && data.amount && data.amount.toString() && data.amount.toString().match(re)?<div className="coupontype" style={{color:coupon.upTextColor}}><span className="priceF">￥</span><span >{data.amount}</span><span className="dyprice">抵用券</span></div>:<div className="coupontype" style={{color:coupon.upTextColor}}>{data.amount}</div>}
						<div className="base" style={{color:coupon.middleTextColor}}>{data.msg}</div>
					</div>
					<div className="lin" style={{color:coupon.downTextColor}}>立即领取 ></div>
				</div>
			)
		});
		if(hongbaoData.length == 1) {
			var listWrap = 	<div className="config1">
								{list}
							</div>;
		}else if(hongbaoData.length == 2) {
			var listWrap = 	<div className="config2">
					{list}
				</div>;
		}else if(hongbaoData.length > 2) {
			var listWrap = 	<div className="config3">
								<div className="config3-wrap">
									<div className="config3-scroll-wrap">
									{list}
									</div>
								</div>
							</div>;			
		}
		return (
			<div className="Coupon-wrap" id={moduleId} style={style}>
				<div className={getRightClassName} id={moduleId+'maodian'}></div>
				<div className="Coupon-wrap-contain">
					{listWrap}
				</div>
			</div>
		);
	}

});

module.exports = Coupon;