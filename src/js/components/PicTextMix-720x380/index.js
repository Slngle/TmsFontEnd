/*
*	爆品模板（特价商品）
*	templateChoose 
*	serverTime
*	hotItem
*/

import style from './index.css';
var AppStoresForPicTextMix720x380 = require('./store');
var AppActionsForPicTextMix720x380 = require('./action');
var addcarts = require('mixin/addcarts');
var lib = require('lib/index');
var PAGE_OS = lib.navigator();
var Img = require("mixinComponents/Img/index");
var Button = require("mixinComponents/Button/index");
window.memeryHotItem = window.memeryHotItem?memeryHotItem:{};
var PicTextMixList = React.createClass({
	addCartTuijian:function(params) {
		if(window.inWeiChat) {
            instance.showTipLayer();
		}else {
			var activityId_activityType = this.props.activityId_activityType;
			params.callback = function(params) {
				params.activityId_activityType = activityId_activityType;
				AppActionsForPicTextMix720x380.setPicTextListData720x380(params);
			}
			addcarts.addCartTuijian(params);	
		}
	},
	delCarts:function(params) {
		if(window.inWeiChat) {
			instance.showTipLayer();
		}else {
			var activityId_activityType = this.props.activityId_activityType;
			params.callback = function(params) {
				params.activityId_activityType = activityId_activityType;
				AppActionsForPicTextMix720x380.setPicTextListData720x380(params);
			}
			addcarts.delCarts(params);
		}
	},
	tuijianLink:function(params){
		if(window.inWeiChat) {
			instance.showTipLayer();
		}else {
			params.type = 'PicTextMix';
			addcarts.tuijianLink(params);
		}
	},
	render: function() {

		var hotItem = this.props.hotItem;
		var templateChoose = window.templateChoose;
		var button = templateChoose && templateChoose.button || {};
		var serverTime = this.props.serverTime;
		var whichBtn = this.props.whichBtn;
		var data = this.props.data;
		var onlineStartTime = data.onlineStartTime || "00:00:00";
		var onlineEndTime = data.onlineEndTime || "24:00:00";
		var activityId_activityType = this.props.activityId_activityType;
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

		if(data.promotionPrice && data.promotionPrice<data.price) {
			var pricePlace = <div className="oldpriceWrap">
								<div className="oldprice">
									<span className="oldpricefh">￥</span>
									<span className="oldpricenum">{lib.parse(data.promotionPrice/100)[0]}</span>
									{lib.parse(data.promotionPrice/100)[1].match('00')?<span></span>:<span className="oldFen">{'.'+lib.parse(data.promotionPrice/100)[1]}</span>}
								</div>
								<div className="price">
									<span>￥</span>
									<span className="lineThrougth">{lib.parse(data.price/100)[0]}</span>
									{lib.parse(data.price/100)[1].match('00')?<span></span>:<span className="lineThrougth">{'.'+lib.parse(data.price/100)[1]}</span>}
								</div>

							</div>;
		}else if(data.promotionPrice) {
			var pricePlace = 	<div className="oldprice">
									<span className="oldpricefh">￥</span>
									<span className="oldpricenum">{lib.parse(data.promotionPrice/100)[0]}</span>
									{lib.parse(data.promotionPrice/100)[1].match('00')?<span></span>:<span className="oldFen">{'.'+lib.parse(data.promotionPrice/100)[1]}</span>}
								</div>;
		}else if(data.price) {
			var pricePlace = 	<div className="oldprice">
									<span className="oldpricefh">￥</span>
									<span className="oldpricenum">{lib.parse(data.price/100)[0]}</span>
									{lib.parse(data.price/100)[1].match('00')?<span></span>:<span className="oldFen">{'.'+lib.parse(data.price/100)[1]}</span>}
								</div>;
		}else {
			var pricePlace = <div className="oldprice"></div>;
		}
		
		
		if(data.specialItem == 1) {
			var specialFood = true;
		}else {
			var specialFood = false;
		}

		return (
			<div className="list-wrap">
				<div className="list-wrap-w">
					<div className='list-padding1'>
						<div className="clickT" onClick={function(){self.tuijianLink(data)}}>
							{specialFood && isOver && data.promotionQuantity>0?<div className="soldoutdivwrap"><div className="soldoutdiv">已结束</div></div>:<div></div>}
							{((specialFood && data.promotionQuantity<=0 && isBegain) || (!specialFood && data.quantity<=0 && isBegain))?<div className="soldoutdivwrap"><div className="soldoutdiv">售罄</div></div>:<div></div>}
							<Img src={lib.returnImgHost()+data.smallPicUrl} size="720x380" rname="list-img" />
						</div>
						<div className="listContent">
							<div className="topTitle">
								{(data.brand || "")+" "+(data.name||"") +" "+(data.property||"") + " / " + (data.unit||"")}
							</div>
							<div className="bottomTitle">
								{(data.description || "")} 
							</div>
						</div>
						<div className="pricePlaceAndBtn">
							<div className="pricePlaceName">
								{pricePlace}
							</div>
							<div className="btnwrap">
								<Button data={data} hotItem={hotItem} serverTime = {serverTime} templateChoose={templateChoose} whichBtn={whichBtn} activityId_activityType={activityId_activityType} callback={function(params){setTimeout(function(){AppActionsForPicTextMix720x380.setPicTextListData720x380(params)},1)}}/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

});

var PicTextMix720x380 = React.createClass({	
	getInitialState:function() {
		var config = this.props.config;
		var moduleId = config.moduleId; 
		var activityId = config.activityId;
		var activityType = config.activityType;
		var hidden = config.hidden;
		var activityId_activityType = lib.combine([activityId,activityType]);
		if(activityId_activityType && (activityId_activityType.match("categoryItem") || activityId_activityType.match("timeline"))) {
			if(entry[activityId_activityType] && entry[activityId_activityType][0] && entry[activityId_activityType][0].data) {
				memeryHotItem[activityId_activityType] = entry[activityId_activityType][0].data || [];
				return (
					{
						hotItem:entry[activityId_activityType][0].data,
						serverTime:entry.serverTime ,
						whichBtn:config.chooseBtn,
						activityId_activityType:activityId_activityType,
						moduleId:moduleId,
						hidden:hidden
					}
				)
			}else {
				return (
					{
						hotItem:[],
						serverTime:entry.serverTime,
						whichBtn:config && config.chooseBtn,
						activityId_activityType:activityId_activityType,
						moduleId:moduleId,
						hidden:hidden
					}
				)				
			}
		}else if(activityId_activityType && activityId_activityType.match("hotItem")){
				memeryHotItem[activityId_activityType] = entry[activityId_activityType] || [];
				return (
					{
						hotItem:entry[activityId_activityType],
						serverTime:entry.serverTime ,
						whichBtn:config.chooseBtn,
						activityId_activityType:activityId_activityType,
						moduleId:moduleId,
						hidden:hidden
					}
				)		
		}else {
			return ({
				hotItem:[]
			})
		}
    },
    componentDidMount: function() {
    	var hotItem = this.state.hotItem;
		if(hotItem && hotItem.length==0) {
			return;
		}

        AppStoresForPicTextMix720x380.addChangeListener(this._onChange);
        var activityId_activityType = this.state.activityId_activityType;
        addcarts.reloadTjCartsNum({hotItems:memeryHotItem[activityId_activityType],callback:function(params){
        	params.activityId_activityType = activityId_activityType;
        	setTimeout(function(){
				AppActionsForPicTextMix720x380.setPicTextListData720x380(params);
        	},1)
        }});
        var moduleId = this.state.moduleId;
        var fastNode = document.getElementById(moduleId);
		if(fastNode) {
			var fast = SGLib.FastClick(fastNode);
		}

        document.addEventListener('updateItemBuyNum', function (e) {
	        addcarts.reloadTjCartsNum({hotItems:memeryHotItem[activityId_activityType],callback:function(params){
	        	params.activityId_activityType = activityId_activityType;
	        	setTimeout(function(){
					AppActionsForPicTextMix720x380.setPicTextListData720x380(params);
	        	},1)
	        }});
		}, false);
    },
    componentDidUpdate:function() {
    	window.img && window.img.fireLazyload && img.fireLazyload();  
    },
    componentWillUnmount: function() {
        AppStoresForPicTextMix720x380.removeChangeListener(this._onChange);
    },
    _onChange: function() {
    	var activityId_activityType = this.state.activityId_activityType;
    	var activityId_activityType_Store = AppStoresForPicTextMix720x380.data.activityId_activityType;
    	if(activityId_activityType == activityId_activityType_Store) {
        	this.setState(AppStoresForPicTextMix720x380.data);
    	}
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
		var hotItem = this.state.hotItem;
		var serverTime = this.state.serverTime;
		var whichBtn = this.state.whichBtn;
		var activityId_activityType = this.state.activityId_activityType;
		memeryHotItem[activityId_activityType] = hotItem;
		var self = this;
		var moduleId = this.state.moduleId; 
		var getRightClassName = this.getRightClassName();
		var hidden = this.state.hidden;

		if(hidden) {
			var strHidden = {
				display:'none'
			}
		}else {
			var strHidden = {
			}			
		}

		if(hotItem && hotItem.length==0) {
			return (
				<div className="PicTextMix720x380" id={moduleId} style={{display:'none'}}>
					<div className={getRightClassName} id={moduleId+'maodian'}></div>
					<div className="PicTextMixWrap">
					</div>
				</div>
			);
		}

		var PicTextMixListWrap = hotItem.map(function(data,i) {
			return (
				<PicTextMixList activityId_activityType = {activityId_activityType} data={data} whichBtn = {whichBtn} serverTime = {serverTime} hotItem={hotItem}/>
			)
		});


		return (
			<div className="PicTextMix720x380" id={moduleId} style={strHidden}>
				<div className={getRightClassName} id={moduleId+'maodian'}></div>
				<div className="PicTextMixWrap">
					{PicTextMixListWrap}
				</div>
			</div>
		);



	}

});
window.AppActionsForPicTextMix720x380 = AppActionsForPicTextMix720x380;
module.exports = PicTextMix720x380;
