import style from './index.css';
var windowLib = window.lib;
var lib = require('lib/index');
var mockData = require('./mockData');
var position = [];
var canclick = true;
var lastElement = []; //上一个获奖的奖品

var ListLi = React.createClass({
	componentDidMount: function() {
		var moveList = document.querySelector('.moveList');
		moveList.classList.add('list-anim');
	},
	render:function() {
		//别人获得的抽奖物品展示
		var data = this.props.otherGetShowData;
		data = data && data.length && data.concat(data[0]);
		var otherGetShow = data.map(function(data) {
			return (
				<li>{data}</li>
			)
		});
		return (
			<ul className="moveList">
				{otherGetShow}
			</ul>
		)
	}
});

var ListPic = React.createClass({
	setDiffTimeout:function(params) {
		var i = params.i;
		var ev = params.ev;
		var len = params.len;
		var callback = params.callback;
		var str = params.str;
		var concatPos = params.concatPos;
		setTimeout(function(i) {
			ev.style.left = concatPos[i].left + 'px';
			ev.style.top = concatPos[i].top + 'px';
			if(i==len-1) {
				setTimeout(function() {
					callback && callback();
				},500);
			}
		},str,i);		
	},
	showScrolling:function(params) {
		var self = this;
		var id = params.id;
		var ev = document.querySelector('.activeScroll');
		var callback = params.callback;		
		if(lastElement && lastElement.length) {
			console.log(lastElement);
			var concatPos = lastElement.concat([]);
			var realPos = position.concat([]);
		} else {
			var concatPos = position.concat([]);
			var realPos = position.concat([]);
		}

		//根据id找出是第几个元素为中奖 
		for(var i=0;i<position.length;i++) {
			if(id==realPos[i].id) {
				realPos = position.slice(0,i+1);
				lastElement = position.slice(i)
				break;
			}
		}

		//加上position整条数据量 增加点旋转数据量 可优化做成math.random
		concatPos = concatPos.concat(position);
		//最后加上最后一个为后端接口id相等的数据
		concatPos = concatPos.concat(realPos);

		var len = concatPos.length;
		var str = 0;
		for(var i=0;i<len;i++) {
			console.log(str);
			if(i<len/2)  {
				str += (len/2-i)*30;
				self.setDiffTimeout({
					i:i,
					ev:ev,
					len:len,
					callback:callback,
					str:str,
					concatPos:concatPos,
				});
			}else if(i == len/2) {
				str += 30;
				self.setDiffTimeout({
					i:i,
					ev:ev,
					len:len,
					callback:callback,
					str:str,
					concatPos:concatPos,
				});
			}else {
				str += (i-len/2)*30;
				self.setDiffTimeout({
					i:i,
					ev:ev,
					len:len,
					callback:callback,
					str:str,
					concatPos:concatPos,
				});
			}
		}
	},
	setChoujian:function(params) {
		if(!canclick) {
			return;
		}
		var self = this;
		canclick = false;
		if(!params) {
			AppActionsForToast.setRightWrong({
				havePic:'wrong',
				content:'抽奖参数异常'
			});
			canclick = true;
		}else if(!params.lotteryDay) {
			AppActionsForToast.setRightWrong({
				havePic:'wrong',
				content:'周二开抽'
			});			
			canclick = true;
		}else if(!params.login) {
			var jsonPrefix = lib.returnHost();
			var loginUrl = 'buyer/personalcenter/php/o2o/login/login_in_app.html?page=new-app-page';
			window.location.href = jsonPrefix + loginUrl; 	
			canclick = true;		
		}else if(!params.remainLotteryTimes) {
			AppActionsForToast.setRightWrong({
				havePic:'wrong',
				content:'次数不够'
			});	
			canclick = true;
		}else {
			windowLib.ajax({
				url: lib.returnHost() + 'market/api/fansarea/lottery.jsonp',
				dataType: 'jsonp',
				success: function(data) {
					var data = {
						"entry": {
							"id": 24,
							"type":2,
							"lotteryCopy": "恭喜你获得一张团长免单券",
							"picUrl": "http://imgsize.52shangou.com/img/n/07/01/1467362887165_3269.jpg",
							"remainTimes": 0
						},
						"message": "",
						"responseCode": 0,
						"status": true
					};

					var message = data && data.message;
					if (!data.status) {
						AppActionsForToast.setRightWrong({
							havePic:'wrong',
							content:message || '抽奖失败'
						});
						return;
					}else {
						console.log('ssasa')
						var choujianarea = document.querySelector('.choujianarea');
						var allData = data && data.entry || {};
						var lotteryCopy = data && data.entry && data.entry.lotteryCopy;
						var type = data && data.entry && data.entry.type;
						var picUrl = data && data.entry && data.entry.picUrl;
						var remainTimes = data && data.entry && data.entry.remainTimes;

						if(!document.querySelector('.activeScroll')) {
							var createDiv = document.createElement('div');
							createDiv.className = "activeScroll";
							createDiv.left = position && position[0] && position[0].left;
							createDiv.top = position && position[0] && position[0].top;
							choujianarea.appendChild(createDiv);
						}
						
						self.showScrolling({
							ev:createDiv,
							id:data && data.entry && data.entry.id,
							callback:function() {
								var wrapForPrizeDraw = document.querySelector('.wrapForPrizeDraw');
								var imgForDraw = document.querySelector('.imgForDraw img');//图片
								var contentForDraw = document.querySelector('.contentForDraw');//文字
								var choujianarea = document.querySelector('.choujianarea');
								var activeScroll = document.querySelector('.activeScroll');
								var check = document.querySelector('.check');
								var showPosition = document.querySelector('.showPosition');

								check.setAttribute('data-type',data && data.entry && data.entry.type);

								if(!data || !data.entry || !data.entry.type || data.entry.type==3 || data.entry.type==4) {
									check.classList.add('hidden');
								}
								
								if(remainTimes == 0) {
									showPosition.innerHTML = "没机会啦！去下单吧";
								}else {
									showPosition.innerHTML = "您有"+remainTimes+"次抽奖机会";
								}
								
								imgForDraw.src = picUrl;
								contentForDraw.innerHTML = lotteryCopy;
								wrapForPrizeDraw.classList.remove('hidden');

								setTimeout(function() {
									wrapForPrizeDraw.style.WebkitTransform = 'scale(1)';
								},1);
								
								

								canclick = true;
							}
						});
					}
				},
				error: function() {
					canclick = true;
				}
			});
		}
	},
	componentDidMount: function() {
		var jiaingp = document.querySelectorAll('.jiangping');
		for(var i=0;i<jiaingp.length;i++) {
			var id = jiaingp[i].getAttribute('data-id');
			if(id) {
				var left = jiaingp[i].offsetLeft;
				var top = jiaingp[i].offsetTop;
				position.push({left:left,top:top,id:id});				
			}
		}

		var three = position[3];
		var four = position[4];
		var five = position[5];
		var six = position[6];
		var seven = position[7];

		position.splice(3,1,four);
		position.splice(4,1,seven);
		position.splice(5,1,six);
		position.splice(6,1,five);
		position.splice(7,1,three);
	},
	render:function() {
		var listData = this.props.data;
		var login = this.props.login;
		var lotteryDay = this.props.lotteryDay;
		var remainLotteryTimes = this.props.remainLotteryTimes
		var self = this;

		// 抽奖按钮信息透出
		if(this.props.btnMesPic) {
			var btnShow = <img src={this.props.btnMesPic} />;			
		}else {
			var btnShow = <div></div>;		
		}
		
		var list = listData.map(function(data,i) {
			if(i==4) {
				return (
					<div className="jiangping" onClick={function(){self.setChoujian({data:data,login:login,lotteryDay:lotteryDay,remainLotteryTimes:remainLotteryTimes})}}>
						{btnShow}
					</div>
				)
			} else {
				return (
					<div className="jiangping" data-id={data.id}>
						<img src={data && data.picUrl?data.picUrl+"@200w_200h_80q_100sh.jpg" : ''} />
					</div>
				)
			}	
		});
		
		return (	
			<div className="choujianarea clear">
				{list}
			</div>
		)

	}
});

var PrizeDraw = React.createClass({
	getInitialState: function() {
		return {
			imgListData:[],//抽奖图片信息
			topPos:'',//顶部信息透出 如没机会啦，快去下单吧 ；登陆查看抽奖次数；您还有3次抽奖机会
			otherGetShowData:[],//别人抽中奖品的列表
			btnMesPic:'',
			login:false,
			lotteryDay:false,
			remainLotteryTimes:0
		};
	},
	componentDidMount: function() {
		var self = this;
		windowLib.ajax({
			url:lib.returnHost()+'market/api/fansarea/lotteryDisplay.jsonp',
			dataType:'jsonp',
			data:{},
			success:function(data) {
				var data = mockData;
				console.log(data);
				var message = data && data.message;
				if(data && data.status == true && data.responseCode == 0) {
					var entry = data && data.entry || {};
					var paramsState = {};

					//topPos 顶部抽奖次数透出
					if(!entry.login) {
						paramsState.topPos = '登陆查看抽奖次数 >'
					}else if(entry.login && !entry.remainLotteryTimes) {
						paramsState.topPos = '没机会啦！去下单吧'
					}else {
						paramsState.topPos = '您有'+entry.remainLotteryTimes+'次抽奖机会'
					}

					//otherGetShowData 别人抽中奖品的列表 如果不是周二 展示周二才能抽奖
					if(!entry.lotteryDay) {
						paramsState.otherGetShowData = []
					}else {
						paramsState.otherGetShowData = entry.lotteryRecode || [];
					}

					//remainLotteryTimes 抽奖次数
					paramsState.remainLotteryTimes = entry.remainLotteryTimes;

					//lotteryDay 是否抽奖那天
					paramsState.lotteryDay = entry.lotteryDay;


					//btnMesPic 不是周二 显示周二抽奖
					//如果未登录或者登陆了没次数 显示 抽奖noactive
					if(!entry.lotteryDay) {
						paramsState.btnMesPic = 'http://imgsize.52shangou.com/img/n/07/04/1467602121516_3442.png';
					}else if(!entry.login || !entry.remainLotteryTimes) {
						paramsState.btnMesPic = 'http://imgsize.52shangou.com/img/n/07/04/1467602120685_2998.png';
					}else {
						paramsState.btnMesPic = 'http://imgsize.52shangou.com/img/n/06/14/1465907477399_6379.png';
					}

					//login
					paramsState.login = entry.login || false;

					//imgListData 抽奖的奖品图片
					entry.lotteryItems && entry.lotteryItems.splice(4,0,{"order":"抽奖按钮"});
					paramsState.imgListData = entry.lotteryItems || [];
					self.setState(paramsState);

				} else {
					AppActionsForToast.setToast({
						type:'alert',
						content:message || '没有数据！'
					});
				}
			},
			error:function(data) {

			}
		})
	},
	goLogin:function(params) {
		var jsonPrefix = lib.returnHost();
		var loginUrl = 'buyer/personalcenter/php/o2o/login/login_in_app.html?page=new-app-page';

		if(!params.login) {
			window.location.href = jsonPrefix + loginUrl;
		}
	},
	touchMove:function(e) {
		e.preventDefault();
	},
	hideFloat:function() {
		var wrapForPrizeDraw = document.querySelector('.wrapForPrizeDraw');
		wrapForPrizeDraw.classList.add('hidden');
		wrapForPrizeDraw.style.WebkitTransform = 'scale(0)';
	},
	check:function(params) {
		var ev = params.ev;
		var target = params.target;
		var host = lib.returnH5Host();
		window.location.href = host + '/trade/user_coupons.html?page=new-app-page';
	},
	render: function() {
		var self = this;
		var config = this.props.config;
		var imgUrl = (config && config.imgUrl && ('url('+config.imgUrl+')') ) || 'url(http://imgsize.52shangou.com/img/n/08/12/1470981048167_1164.png)';
		var imgListData = this.state.imgListData;
			

			
		if(imgListData && imgListData.length) {
			var list = 	<ListPic data={imgListData} btnMesPic={self.state.btnMesPic} login={self.state.login} lotteryDay={self.state.lotteryDay} remainLotteryTimes={self.state.remainLotteryTimes} />;

		}else {
			var list = <div />;
		}

		if(this.state.otherGetShowData && this.state.otherGetShowData.length) {
			var peopleList = <ListLi otherGetShowData = {this.state.otherGetShowData} />;

		}else {
			var peopleList = <div> 小主，周二才能抽奖哦 </div>;
		}

		return (
			<div className="PrizeDraw" style={{backgroundImage:imgUrl}} >
				<div className="showPosition" onClick={function(){self.goLogin({login:self.state.login})}}>
					{this.state.topPos}
				</div>

				<div className="showPeople">
					{peopleList}
				</div>
				{list}

				<div className="wrapForPrizeDraw hidden" onTouchMove={function(ev){self.touchMove(ev)}}>
					<div className="wrapInForPrizeDraw">
						<div className="chacha" onClick={this.hideFloat}></div>
						<div className="imgForDraw">
							<img src="" />
						</div>
						<div className="contentForDraw">
						</div>
						<div className="check" onClick={function(ev){self.check({ev:ev})}}>
							查看我的优惠
						</div>
						<div className="continue" onClick={this.hideFloat}>
							继续抽奖
						</div>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = PrizeDraw;