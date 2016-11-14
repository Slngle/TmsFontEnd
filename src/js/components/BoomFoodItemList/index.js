/*
*	爆品模板（特价商品）
*	templateChoose 
*	serverTime
*	hotItem
*/
import style from './index.css';
var AppStoresForBoomFoodItemList = require('./store');
var AppActionsForBoomFoodItemList = require('./action');
var addcarts = require('mixin/addcarts');
var Img = require("mixinComponents/Img/index");
var Button = require("mixinComponents/Button/index");
var lib = require('lib/index');
var PAGE_OS = lib.navigator();
window.memeryHotItem = window.memeryHotItem?memeryHotItem:{};

var BoomFoodList = React.createClass({
	tuijianLink:function(params) {
		if(window.inWeiChat) {
			instance.showTipLayer();
		}else {
			addcarts.tuijianLink(params);
		}
	},
	render: function() {
		var data = this.props.data;
		var hotItem = this.props.hotItem;
		var onlineStartTime = data.onlineStartTime || '00:00:00';
		var onlineEndTime = data.onlineEndTime || '24:00:00';
		var serverTime = this.props.serverTime;
		var templateChoose = window.templateChoose;
		var button = templateChoose && templateChoose.button || {};
		var whichBtn = this.props.whichBtn;
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

		var i = this.props.i;
		//memeryCartNumBoom[i] = data.cartNum;

		if(data.promotionPrice && data.promotionPrice<data.price) {
			var pricePlace = <div><div className="price">
								<span>原价 ￥</span>
								<span className="lineThrougth">{lib.parse(data.price/100)[0]}</span>
								{lib.parse(data.price/100)[1].match('00')?<span></span>:<span className="lineThrougth">{'.'+lib.parse(data.price/100)[1]}</span>}
							</div>
							<div className="oldprice">
								<span className="oldpricefh">￥</span>
								<span className="oldpricenum">{lib.parse(data.promotionPrice/100)[0]}</span>
								{lib.parse(data.promotionPrice/100)[1].match('00')?<span></span>:<span className="oldFen">{'.'+lib.parse(data.promotionPrice/100)[1]}</span>}
							</div>
							</div>;
		}else if(data.promotionPrice) {
			var pricePlace = 	<div className="oldprice">
									<span className="oldpricefh">￥</span>
									<span className="oldpricenum">{lib.parse(data.promotionPrice/100)[0]}</span>
									{lib.parse(data.promotionPrice/100)[1].match('00')?<span></span>:<span className="oldFen">{'.'+lib.parse(data.promotionPrice/100)[1]}</span>}
								</div>;
		}else {
			var pricePlace = <div className="oldprice">
									<span className="oldpricefh">￥</span>
									<span className="oldpricenum">{lib.parse(data.price/100)[0]}</span>
									{lib.parse(data.price/100)[1].match('00')?<span></span>:<span className="oldFen">{'.'+lib.parse(data.price/100)[1]}</span>}
								</div>;
		}


		if(	data.specialItem == 1) {
			var specialFood = true;
		}else {
			var specialFood = false;
		}

		return (
			<div className="boomFoodList">
				<div className="imgwrapPos" onClick={function(){self.tuijianLink(data)}}>
					{specialFood && isOver && data.promotionQuantity>0?<div className="soldoutdivwrap"><div className="soldoutdiv">已结束</div></div>:<div></div>}
					{(specialFood && data.promotionQuantity<=0 && isBegain) || (!specialFood && data.quantity<=0 && isBegain)?<div className="soldoutdivwrap"><div className="soldoutdiv">售罄</div></div>:<div></div>}
					<Img src={lib.returnImgHost()+data.smallPicUrl} rname="boomFoodListImg" size="240x241" />
				</div>
				<div className="boomFoodListText">
					<div className="foodListTitle">
						<span className="tleft">{data.brand}</span>
						<span className="tright">{" "+(data.name||"") + (data.property||"") + " / " + (data.unit||"")}</span>
					</div>
					<div className="pricePlace">
						<div className="pricePlaceLeft">							
							{pricePlace}
						</div>
						<div className="pricePlaceRight">
							<Button data={data} hotItem={hotItem} serverTime = {serverTime} templateChoose={templateChoose} whichBtn={whichBtn} activityId_activityType={activityId_activityType} callback={function(params){setTimeout(function(){AppActionsForBoomFoodItemList.setListData(params)},1)}}/>
						</div>
					</div>
				</div>
			</div>
		);
	}

});

var BoomFood = React.createClass({	
	getInitialState:function() {
		var config = this.props.config;
		var activityId = config.activityId;
		var activityType = config.activityType;
		var moduleId = config.moduleId; 
		var hidden = config.hidden;
		var activityId_activityType = activityId && activityType && lib.combine([activityId,activityType]) || '';
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
						serverTime:entry.serverTime ,
						whichBtn:config.chooseBtn,
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
        AppStoresForBoomFoodItemList.addChangeListener(this._onChange);
        var activityId_activityType = this.state.activityId_activityType;
		
        var moduleId = this.state.moduleId;
        var fastNode = document.getElementById(moduleId);
		if(fastNode) {
			var fast = SGLib.FastClick(fastNode);
		}

        addcarts.reloadTjCartsNum({hotItems:memeryHotItem[activityId_activityType],callback:function(params){
        	params.activityId_activityType = activityId_activityType;
        	setTimeout(function(){
				AppActionsForBoomFoodItemList.setListData(params)
        	},1);
        }});

        document.addEventListener('updateItemBuyNum', function (e) {
	        addcarts.reloadTjCartsNum({hotItems:memeryHotItem[activityId_activityType],callback:function(params){
	        	params.activityId_activityType = activityId_activityType;
	        	setTimeout(function(){
					AppActionsForBoomFoodItemList.setListData(params)
	        	},1);
	        }});
		}, false);
    },
    componentDidUpdate:function() {
    	window.img && window.img.fireLazyload && window.img.fireLazyload();

    },
    componentWillUnmount: function() {
        AppStoresForBoomFoodItemList.removeChangeListener(this._onChange);
    },
    _onChange: function() {
    	var activityId_activityType = this.state.activityId_activityType;
    	var activityId_activityType_Store = AppStoresForBoomFoodItemList.data.activityId_activityType;
    	if(activityId_activityType == activityId_activityType_Store) {
			this.setState(AppStoresForBoomFoodItemList.data);
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
		var moduleId = this.state.moduleId; 
		var hidden = this.state.hidden;
		memeryHotItem[activityId_activityType] = hotItem;
		var self = this;
		var getRightClassName = this.getRightClassName();
		var BoomFoodListWrap = hotItem.map(function(data,i) {
			return (
				<BoomFoodList i={i} activityId_activityType = {activityId_activityType} whichBtn = {whichBtn} data = {data} serverTime = {serverTime} hotItem = {hotItem} />
			)
		});

		if(hidden) {
			var strHidden = {
				display:'none'
			}
		}else {
			var strHidden = {
			}	
		}

		if(!hotItem || hotItem.length==0) {
			return (
				<div className="boomFood"  id={moduleId} style={{display:'none'}}>
					<div className={getRightClassName} id={moduleId+'maodian'}></div>
				</div>
			);
		}else {
			return (
				<div className="boomFood" id={moduleId} style={strHidden}>
					<div className={getRightClassName} id={moduleId + 'maodian'}></div>
					{BoomFoodListWrap}
				</div>
			);
		}

	}

});
window.AppActionsForBoomFoodItemList = AppActionsForBoomFoodItemList;
module.exports = BoomFood;
