import style from './index.css';
var addcarts = require('mixin/addcarts');
var Button = React.createClass({
	addCartTuijian:function(params) {
		var self = this;
		if(window.inWeiChat) {
            instance.showTipLayer();
		}else {
			var activityId_activityType = this.props.activityId_activityType;
			var setId = activityId_activityType && activityId_activityType.split('_') && activityId_activityType.split('_')[0];
			params.callback = function(params){
				params.activityId_activityType = activityId_activityType;
				self.props.callback(params);
			}
			params.setId = setId;
			addcarts.addCartTuijian(params);
		}
	},
	delCarts:function(params) {
		var self = this;
		if(window.inWeiChat) {
			instance.showTipLayer();
		}else {
			var activityId_activityType = this.props.activityId_activityType;
			var setId = activityId_activityType && activityId_activityType.split('_') && activityId_activityType.split('_')[0];
			params.callback = function(params){
				params.activityId_activityType = activityId_activityType;
				self.props.callback(params);
			}
			params.setId = setId;
			addcarts.delCarts(params);
		}
	},
	render: function() {
		var data = this.props.data;
		var hotItem = this.props.hotItem;
		var onlineStartTime = data.onlineStartTime || '00:00:00';
		var onlineEndTime = data.onlineEndTime || '24:00:00';
		var serverTime = this.props.serverTime;
		var templateChoose = this.props.templateChoose;
		var whichBtn = this.props.whichBtn;
		var activityId_activityType = this.props.activityId_activityType;
		var templateChoose = window.templateChoose;
		var button = templateChoose && templateChoose.button || {};
		var lib = require('lib/index');
		var self = this;

		var message = lib.compare({
			onlineStartTime:onlineStartTime,
			onlineEndTime:onlineEndTime,
			serverTime:serverTime
		});

		if(message == 'wait') {
			var isBegain = false;
			var isOver = false;
		}else if(message == 'end'){
			var isBegain = true;
			var isOver = true;
		}else {
			var isBegain = true;
			var isOver = false;
		}

		if(	data.specialItem == 1) {
			var specialFood = true;
		}else {
			var specialFood = false;
		}

		if(whichBtn == 'case1') {
			var btnInner = '立即加购';
		}else {
			var btnInner = '加入购物车';
		}

		if(whichBtn == 'case2') {
			var splitTime = onlineStartTime && onlineStartTime.split(" ");
			var splitTimehhmm = splitTime && splitTime[1] && splitTime[1].split(':');
			var hhmm = splitTimehhmm[0] + ':' +splitTimehhmm[1] + '开抢';
            var styleWidth = data && (data.promotionQuantityCache/(data.promotionQuantityCache+data.promotionSoldQuantityCache))*100;
            var styleWidthToBFB = styleWidth && (styleWidth.toString() +'%');
		}else {
			var splitTime = "";
			var splitTimehhmm = "";
			var hhmm = "";
            var styleWidth = "";
            var styleWidthToBFB = "";
		}

		var btnAll = {}
		//case1 和 case4的按钮样式
		btnAll.cartNumLessThanOne = <div className="shop" style={{backgroundColor:button.backgroundColor,borderColor:button.borderColor}} onClick={function(ev){self.addCartTuijian({item:data,ev:ev,dataAll:hotItem,type:'boom',setId:data.setId,specialFood:specialFood})}}>{btnInner}</div>;
		btnAll.cartNumMoreThanOne = <div className="btn-wrap-wrap">
						<div className="btn-wrap clear">
							<div className = 'warp-for-line'>
								<div className="btn" onClick={function(ev){self.addCartTuijian({item:data,ev:ev,dataAll:hotItem,type:'boom',setId:data.setId,specialFood:specialFood})}}>
									<div className="trans-background"></div>
								</div>
							</div>
						</div>
						<div className={data.cartNum!=0?"ab-price ab-price-act":"ab-price"}>
							<div className="in-ab">
								<div className="left-jia" onClick={function(){self.delCarts({item:data,dataAll:hotItem,type:'boom',setId:data.setId,specialFood:specialFood})}}></div>
								<div className="in-num">{data.cartNum || 0}</div>
							</div>
						</div>
					</div>;
		btnAll.willPanicBuying = <div className="shop zh spcolor">即将开抢</div>;
		//case1 和 case4的按钮样式


		//case2的按钮
		btnAll.panicBuying = <div className="right-wrap clear" style={{marginTop:0}} onClick={function(ev){self.addCartTuijian({item:data,ev:ev,dataAll:hotItem,type:'boom',setId:data.setId,specialFood:specialFood})}}>
						<div className="right-z-q" >
                            <div className="clip-wrap">
                                <div className="clip-abs" style={{width:styleWidthToBFB}}></div>
                                <p className='rz-top-q'>{data.promotionQuantityCache?'仅剩'+data.promotionQuantityCache+'件':''}</p>
                            </div>
                            <p className="rz-bottom-q">立即加购</p>
                        </div>
					</div>;

		btnAll.willPanicBuyingCase2 = <div className="right-wrap clear" style={{marginTop:0}}>
					    <div className="right-z-q right-blue">
	                        <div className="clip-wrap">
	                            <p className='rz-top-q rz-top-q-blue'>{hhmm}</p>
	                        </div>
	                        <p className="rz-bottom-q grabBtnBlue">即将开抢</p>
	                    </div>
                    </div>;

		//case2的按钮

		//case3的按钮
		btnAll.goAllMid = <div className="shop" style={{backgroundColor:button.backgroundColor,borderColor:button.borderColor}}  onClick={function(ev){self.addCartTuijian({item:data,ev:ev,dataAll:hotItem,type:'boom',setId:data.setId,specialFood:specialFood})}}>去开团</div>;
		//case3的按钮
		if(whichBtn == 'case1' || whichBtn == 'case4') {
			//不是特价商品的不会走即将开抢逻辑
			if(specialFood) {
				if(!isBegain) {
					var btn = btnAll.willPanicBuying;
				}else if((data.promotionQuantity==0 && isBegain) || isOver) {
					var btn = <div></div>;
				}else if(isBegain && data.cartNum<=0) {
					var btn = btnAll.cartNumLessThanOne;	
				}else if(isBegain && data.cartNum>0) {
					var btn = btnAll.cartNumMoreThanOne;
				}else {
					var btn = btnAll.willPanicBuying;
				}
			}else {
				if(data.quantity == 0) {
					var btn = <div></div>;
				} else if(data.cartNum<=0) {
					var btn = btnAll.cartNumLessThanOne;
				} else if(data.cartNum>0) {
					var btn = btnAll.cartNumMoreThanOne;
				}
			}

			// if(!specialFood && data.cartNum<=0) {
			// 	var btn = btnAll.cartNumLessThanOne;
			// }else if(!specialFood && data.cartNum>0) {
			// 	var btn = btnAll.cartNumMoreThanOne;
			// }else if(!isBegain && specialFood) {
			// 	var btn = btnAll.willPanicBuying;
			// }else if((data.promotionQuantity==0 && isBegain) || (isOver && specialFood)){
			// 	var btn = <div></div>;
			// }else if(isBegain && data.cartNum<=0){
			// 	var btn = btnAll.cartNumLessThanOne;
			// }else if(isBegain && data.cartNum>0) {
			// 	var btn = btnAll.cartNumMoreThanOne;
			// }else {
			// 	var btn = btnAll.willPanicBuying;
			// }

		}else if(whichBtn == 'case2') {
            //不是特价商品的不会走即将开抢逻辑
            if(specialFood) {
            	if(!isBegain) {
            		var btn = btnAll.willPanicBuyingCase2;
            	} else if((data.promotionQuantity==0 && isBegain) || isOver) {
            		var btn = <div></div>;
            	} else {
            		var btn = btnAll.panicBuying;
            	}
            }else {
            	if(data.quantity==0) {
					var btn = btnAll.willPanicBuyingCase2;
            	}else {
            		var btn = btnAll.panicBuying;
            	}
            }

   //          if(!specialFood) {
   //  			var btn = btnAll.panicBuying;
   //          }else if(!isBegain) {
			// 	var btn = btnAll.willPanicBuyingCase2;
			// }else if((data.promotionQuantity==0 && isBegain) || isOver){
			// 	var btn = <div></div>;
			// }else if(isBegain) {
			// 	var btn = btnAll.panicBuying;
			// }else {
			// 		var btn = btnAll.willPanicBuyingCase2;
			// }

		}else if(whichBtn == 'case3') {
			var btn = btnAll.goAllMid;
		}else if(whichBtn == 'case5') {
			var btn = btnAll.cartNumMoreThanOne;
		}

		return (
			<div>
				{btn}
			</div>
		);
	}

});

module.exports = Button;