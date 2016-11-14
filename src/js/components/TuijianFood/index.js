/*
*推荐商品模板
*
*
*/

import style from './index.css';
var AppStoresForTuijianFood = require('./store');
var AppActions = require('./action');
var lib = require('lib/index.js');
var addcarts = require('mixin/addcarts');
var Img = require("mixinComponents/Img/index");
var Button = require("mixinComponents/Button/index");
var PAGE_OS = lib.navigator();

window.memeryHotItem = window.memeryHotItem?memeryHotItem:{};
var LimitTimeList = React.createClass({
    addCartTuijian:function(params) {
    	if(window.inWeiChat) {
            instance.showTipLayer();
		}else {
			var activityId_activityType = this.props.activityId_activityType;
			params.callback = function(params){
				params.activityId_activityType = activityId_activityType;
				AppActionsForTuijianFood.setTuijianListData(params);
			}
			addcarts.addCartTuijian(params);	
		}
    },
    delCarts:function(params) {
    	if(window.inWeiChat) {
            instance.showTipLayer();
		}else {
			var activityId_activityType = this.props.activityId_activityType;
			params.callback = function(params){
				params.activityId_activityType = activityId_activityType;
				AppActionsForTuijianFood.setTuijianListData(params);
			}
			addcarts.delCarts(params);
		}
    },
    tuijianLink:function(params) {
    	if(window.inWeiChat) {
            instance.showTipLayer();
		}else {
    		addcarts.tuijianLink(params);
		}
    },
	render: function() {
		var hotItem = this.props.hotItems ;
		var self = this;
		var shopIder = hotItem && hotItem[0] && hotItem[0].shopId;
		var judy;

		var tagHtml;
		var tagListHtml;
		var data = this.props.data;
		var i = this.props.i;
		var keyId = this.props.keyId;
		var serverTime = this.props.serverTime;
		var whichBtn = this.props.whichBtn;
		var templateChoose = window.templateChoose;
		var button = templateChoose && templateChoose.button || {};
		var onlineStartTime = data.onlineStartTime || "00:00:00";
		var onlineEndTime = data.onlineEndTime || "24:00:00";
		var activityId_activityType = this.props.activityId_activityType;
		var message = lib.compare({
			onlineStartTime:onlineStartTime,
			onlineEndTime:onlineEndTime,
			serverTime:serverTime
		});
		if(message == 'wait') {
			var isBegain = false;
			var isOver = false;
		}else if(message == 'end'){
			var isBegain = false;
			var isOver = true;
		}else {
			var isBegain = true;
			var isOver = false;
		}


		if(data.tagNames && data.tagNames.length > 0) {
			tagListHtml = data.tagNames.map(function(v,i){
			  return <em className="tag">{v}</em>
			});
			tagHtml = (
			  <span className="item-tags">{tagListHtml}</span>
			)
		}

		if(data.promotionPrice != 0 && data.promotionPrice != data.price && data.price) {
			var priceCom = 	<div className="pricenow">
								<p>{'￥'+data.promotionPrice/100}</p>
								<p className="priceold">
									<span>￥</span>
									<span className="priceoldspan">{lib.parse(data.price/100)[0]}</span>
									{lib.parse(data.price/100)[1].match("00")?<span></span>:<span className="priceoldspan">{'.'+lib.parse(data.price/100)[1]}</span>}
								</p>
							</div>;
		}else if(data.promotionPrice != 0 && data.promotionPrice == data.price) {
			if(lib.parse(data.price/100)[1].match('00')) {
				var priceCom = <p className="pricenow">{'￥'+lib.parse(data.price/100)[0]}</p>;
			}else {
				var priceCom = <p className="pricenow">{'￥'+lib.parse(data.price/100)[0]+'.'+lib.parse(data.price/100)[1]}</p>;
			}
		}else if(data.price){
			if(lib.parse(data.price/100)[1].match('00')) {
				var priceCom = <p className="pricenow">{'￥'+lib.parse(data.price/100)[0]}</p>;
			}else {
				var priceCom = <p className="pricenow">{'￥'+lib.parse(data.price/100)[0]+'.'+lib.parse(data.price/100)[1]}</p>;
			}
			
		}else {
			var priceCom = <p className="pricenow"></p>;
		}

		if(data.specialItem == 1) {
			var specialFood = true;
		}else {
			var specialFood = false;
		}

		return (
				<div className={!(i%2)?'act-li normal-li':'normal-li'}>
					<div className="list-view-wrap-box">
						<div className="imgbox" onClick={function(){self.tuijianLink(data)}}>
							{specialFood && isOver && data.promotionQuantity>0?<div className="soldoutdivwrap"><div className="soldoutdiv">已结束</div></div>:<div></div>}
							{((specialFood && data.promotionQuantity<=0 && isBegain) || (!specialFood && data.quantity<=0 && isBegain))?<div className="soldoutdivwrap"><div className="soldoutdiv">售罄</div></div>:<div></div>}
							<Img src={lib.returnImgHost()+data.smallPicUrl} size="330x330" rname="list-img" />
						</div>
						<h1 className="list-title">
							<span className="brand">{data.brand?data.brand+" ":""}</span>
							<span className="name">{data.name}</span>
						</h1>
						<p className="list-intro">{tagHtml}{data.property}</p>
						<div className="price">
							{priceCom}
							<div className="btnwrapls">
								<Button data={data} hotItem={hotItem} serverTime = {serverTime} templateChoose={templateChoose} whichBtn={whichBtn} activityId_activityType={activityId_activityType} callback={function(params){setTimeout(function(){AppActionsForTuijianFood.setTuijianListData(params)},1)}} />
							</div>
						</div>
					</div>
				</div>
		)
	}

});

var LimitTime = React.createClass({
	getInitialState:function() {
		var config = this.props.config;
		var activityId = config.activityId;
		var activityType = config.activityType;
		var moduleId = config.moduleId;
		var hidden = config.hidden;
		var activityId_activityType = activityId && activityType && lib.combine([activityId,activityType]);
		if( activityId_activityType && (activityId_activityType.match("categoryItem") || activityId_activityType.match("timeline"))) {
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
				hotItem:[],
				activityId_activityType:activityId_activityType,
				serverTime:entry.serverTime,
				moduleId:moduleId,
				hidden:hidden
			})
		}
    },
    componentDidMount: function() {
    	var hotItems = this.state.hotItem;
    	var moduleId = this.state.moduleId;
    	if(!hotItems || hotItems.length==0) {
    		return;
    	}
        AppStoresForTuijianFood.addChangeListener(this._onChange);
		var activityId_activityType = this.state.activityId_activityType;

        addcarts.reloadTjCartsNum({hotItems:memeryHotItem[activityId_activityType],callback:function(params){
        	params.activityId_activityType = activityId_activityType;
        	setTimeout(function(){
        		AppActionsForTuijianFood.setTuijianListData(params)
        	},1)
        }});
        
		var fastNode = document.getElementById(moduleId);
		if(fastNode) {
			var fast = SGLib.FastClick(fastNode);
		}

        document.addEventListener('updateItemBuyNum', function (e) {
	        addcarts.reloadTjCartsNum({hotItems:memeryHotItem[activityId_activityType],callback:function(params){
	        	params.activityId_activityType = activityId_activityType;
	        	setTimeout(function(){
	        		AppActionsForTuijianFood.setTuijianListData(params)
	        	},1)
	        }});
		}, false);
    },
    componentWillUnmount: function() {
        AppStoresForTuijianFood.removeChangeListener(this._onChange);
    },
    _onChange: function() {
    	var activityId_activityType = this.state.activityId_activityType;
    	var activityId_activityType_Store = AppStoresForTuijianFood.data.activityId_activityType;
    	if(activityId_activityType == activityId_activityType_Store) {
			this.setState(AppStoresForTuijianFood.data);
    	}
    },
    componentDidUpdate:function() {
    	window.img && window.img.fireLazyload && img.fireLazyload();  
    },
   	getRightClassName:function() {
   		if(PAGE_OS.isApp) {
   			if(lib.getByUrl('tspBar') == 'true') {
	    		if(PAGE_OS.isIOS) {
	   				return "iosPos";
	   			} else {
	   				return "androidPos";
	   			}
   			} else {
   				return "normal-posdiv";
   			}
   		} else {
   			return "normal-posdiv";
   		}
   	},
	render: function() {
		var hotItems = this.state.hotItem;
		var serverTime = this.state.serverTime;
		var self = this;
		var shopIder = hotItems && hotItems[0] && hotItems[0].shopId;
		var whichBtn = this.state.whichBtn || 'case1';
		var activityId_activityType = this.state.activityId_activityType;
		var moduleId = this.state.moduleId;
		var judy;
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
		memeryHotItem[activityId_activityType] = hotItems;

			if(!hotItems || hotItems.length==0) {
				return (
					<div className="limitTime-wrap" id={moduleId} style={{display:'none'}}>
						<div className={getRightClassName} id={moduleId+'maodian'}></div>
						<div className="list-view">
							<div className="list-view-wrap clear">
							</div>
						</div>
					</div>
				)

			}

			var list = hotItems.map(function(data,i) {
				return (
					<LimitTimeList activityId_activityType = {activityId_activityType} whichBtn = {whichBtn} serverTime = {serverTime} hotItems = {hotItems} data = {data} i = {i} keyId = {data.id} />
				)
			});


			return (
				<div className="limitTime-wrap" id={moduleId} style={strHidden}>
					<div className={getRightClassName} id={moduleId+'maodian'}></div>
					<div className="list-view">
						<div className="list-view-wrap clear">
							{list}
						</div>
					</div>
				</div>
			);
	}




});
window.AppActionsForTuijianFood = AppActions;
module.exports = LimitTime;