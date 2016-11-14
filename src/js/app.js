import style from '../css/index.css';

var AppStores = require('AppStores');
var AppActions = require('AppActions'); 
var lib = require('lib/index');
var Error = require('mixinComponents/Abnormal/index');
var Toast = require('mixinComponents/Toast/index');
window.img = new SGLib.img({
      'class': 'lazyload-img',//img 样式名称
      'lazyHeight': 0,
      'lazyWidth': 0,
      'fireEvent': 'scroll'
});

//需要手动添加的
var BoomFoodItemList = require('components/BoomFoodItemList/index');
var ShoppingCarts = require('components/ShoppingCarts/index');
var TuijianFood = require('components/TuijianFood/index');
var PicTextMix720x380 = require('components/PicTextMix-720x380/index');
var PicTextMix650x650 = require('components/PicTextMix-650x650/index');
var TopBanner = require('components/TopBanner/index');
var RuleContent = require('components/RuleContent/index');
var Navigation = require('components/Navigation/index');
var Timeline = require('components/Timeline/index');
var Coupon = require('components/Coupon/index');
var SeparatorBar = require('components/SeparatorBar/index');
var Share = require('components/Share/index');
var RedEnvelope = require('components/RedEnvelope/index');
var PrizeDraw = require('components/PrizeDraw/index');
var FloorNav = require('components/FloorNav/index');
var TimelineMoudle = require('components/TimelineMoudle/index')
var SliderArea = require('components/SliderArea/index');
var Dole = require('components/Dole/index');
var HotPoint = require('components/HotPoint/index');
//需要手动添加的

//模拟的mock数据

window.onerror = function(a,b,c) {
    alert(a+'/'+b+'/'+c);
}
window.templateChoose = {
    bodyBg:{
        backgroundColor:"#ffe600"//主题背景色
    },
    timeline:{
        backgroundColor:'#473c3c',//时间轴背景色 
        countdown:{
            backgroundColor:'#f44e4e',//倒计时背景色
            textColor:'#ffffff'//倒计时字体颜色
        }
    },
    coupon:{
        backgroundImageShort:'http://imgsize.52shangou.com/img/n/07/27/1469604042635_1643.png',//优惠券超过一个时的背景短图
        backgroundLong:'http://imgsize.52shangou.com/img/n/07/27/1469604037663_4562.png',//优惠券一个时候的背景长图
        upTextColor:'#000000',//优惠券上面的字的颜色
        middleTextColor:'#333333',//优惠券中间字的颜色
        downTextColor:'#fa4100'//优惠券下边字的颜色
    },
    navigation:{
        backgroundColor:'#F44E4E',//导航类目背景颜色
        shadow:"linear-gradient(-90deg, rgba(231,51,51,100) 0%, rgba(244,78,78,0) 100%)"//右左 导航类目渐变色  左边是颜色深的色值 右边是颜色浅的色值
    },
    button:{
        backgroundColor:'#ff5c5c',//按钮背景颜色
        borderColor:'#f05656'//按钮边框颜色
    },
    separatorBar:{
        color:'#ffffff'//分隔栏字体颜色
    },
    ruleContent:{
        color:"#ffffff" //规则的字体颜色
    }
}

window.entry = {};
//entry.serverTime = '2016-8-4 16:45:00';
var oDateSend = new Date();
entry.serverTime = oDateSend.getFullYear() +'-' +(oDateSend.getMonth()+1)+'-'+oDateSend.getDate()+" "+oDateSend.getHours()+":"+oDateSend.getMinutes()+":"+oDateSend.getSeconds();

//普通商品数据 （既无导航 也无时间轴）
var config1 = {
    "activityId":'1000',
    "activityType":"hotItem",
    'chooseBtn':'case1',
}

entry['1001_hotItem'] = [{
    id:'954216',
    buylimit:1,
    onlineStartTime:'1970-1-1 8:00:00',
    onlineEndTime:'1970-1-1 23:00:00',
    promotionPrice:'1040',
    price:'2020',
    promotionQuantity:'0',
    quantity:0,
    cartNum:'0',
    smallPicUrl:'n/08/07/1470547941690_9847.jpg',
    brand:'蒙牛',
    name:'超好喝酸奶',
    property:'100ml',
    unit:'盒',
    shopId:6513,
    promotionQuantityCache:10,
    setId:15043,
    promotionStatus:true,
    promotionType:2
  },{
    id:'954216',
    buylimit:1,
    onlineStartTime:'1970-1-1 8:00:00',
    onlineEndTime:'1970-1-1 23:00:00',
    promotionPrice:'1030',
    price:'2090',
    promotionQuantity:'20',
    cartNum:'0',
    smallPicUrl:'n/08/07/1470547941690_9847.jpg',
    brand:'蒙牛',
    name:'超好喝酸奶',
    property:'100ml',
    unit:'盒',
    shopId:6513,
    promotionQuantityCache:10,
    setId:15043,
    promotionStatus:true,
    promotionType:2
  }];

//有类目导航的商品数据格式
var config2 = {
    "activityId":'1000',
    "activityType":'categoryItem',
    'chooseBtn':'case5',
    "moduleId":'000',
}

entry['1000_categoryItem'] = [
    {
      id:'30',
      name:'全部商品',
      data:[{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1040',
        price:'2020',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      },{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      }]
    },
    {
      id:'30',
      name:'四季鲜果',
      data:[{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'水果',
        name:'好吃的水果',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      }]
    },
    {
      id:'30',
      name:'时令水果',
      data:[{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1090',
        price:'2020',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'而且为其',
        name:'好吃的水果而且委屈委屈委屈委屈我',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      }]
    },
    {
      id:'30',
      name:'时令水果',
      data:[{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1090',
        price:'2020',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'而且为其',
        name:'好吃的水果而且委屈委屈委屈委屈我',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      }]
    },
    {
      id:'30',
      name:'时令水果',
      data:[{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1090',
        price:'2020',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'而且为其',
        name:'好吃的水果而且委屈委屈委屈委屈我',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      }]
    },    
    {
      id:'30',
      name:'时令水果',
      data:[{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1090',
        price:'2020',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'而且为其',
        name:'好吃的水果而且委屈委屈委屈委屈我',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      }]
    }
  ];

//时间轴的商品的数据格式
var config3 = {
    "activityId":'1000',
    "activityType":"timeline",
    'chooseBtn':'case1',
    "moduleId":'xxx',
}

entry['1000_timeline'] = [
    {
      id:'30',
      name:'全部商品',
      data:[{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1040',
        price:'2020',
        promotionQuantity:'0',
        quantity:'0',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      },{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2,
        specialItem: 1,
      },{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2,
        specialItem: 1,
      },{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2,
        specialItem: 1,
      },{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2,
        specialItem: 1,
      },{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2,
        specialItem: 1,
      },{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2,
        specialItem: 1,
      },{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2,
        specialItem: 1,
      },{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2,
        specialItem: 1,
      },{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2,
        specialItem: 1,
      },{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'蒙牛',
        name:'超好喝酸奶',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2,
        specialItem: 1,
      }]
    },
    {
      id:'30',
      name:'四季鲜果',
      data:[{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'水果',
        name:'好吃的水果',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      }]
    },
    {
      id:'30',
      name:'四季鲜果',
      data:[{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'水果',
        name:'好吃的水果',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      }]
    },
    {
      id:'30',
      name:'四季鲜果',
      data:[{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1030',
        price:'2090',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'水果',
        name:'好吃的水果',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      }]
    },
    {
      id:'30',
      name:'时令水果',
      data:[{
        id:'954216',
        buylimit:1,
        onlineStartTime:'1970-1-1 8:00:00',
        onlineEndTime:'1970-1-1 23:00:00',
        promotionPrice:'1090',
        price:'2020',
        promotionQuantity:'20',
        cartNum:'0',
        smallPicUrl:'n/08/07/1470547941690_9847.jpg',
        brand:'而且为其',
        name:'好吃的水果而且委屈委屈委屈委屈我',
        property:'100ml',
        unit:'盒',
        shopId:6513,
        promotionQuantityCache:10,
        setId:15043,
        promotionStatus:true,
        promotionType:2
      }]
    }
  ];

//类目导航数据格式
var config4 = {
    "activityId":'1000',
    "activityType":'navigation',
    "connect":[{
        relevanceModule:'BoomFoodItemList',
        relevanceData:'1000_categoryItem',
    },{
        relevanceModule:'TuijianFood',
        relevanceData:'1000_categoryItem',
    },{
        relevanceModule:'PicTextMix',
        relevanceData:'1000_categoryItem',
    }]
}

entry['1000_navigation'] = [{id:1,name:'全部商品'},{id:2,name:'每日鲜果'},{id:3,name:'时令水果'},{id:4,name:'零食百货'}];

//时间轴数据格式
var config5 = {
    "activityId":"1000",
    "activityType":"TimelineNav",
    "connect":[{
        relevanceModule:'BoomFoodItemList',
        relevanceData:'1000_timeline'
    },{
        relevanceModule:'TuijianFood',
        relevanceData:'1000_timeline'
    },{
        relevanceModule:'PicTextMix720x380',
        relevanceData:'1000_timeline'
    }]
};

entry['1000_TimelineNav'] = [{
    name:'12:00',
    onlineStartTime:'2016-8-6 13:47:00',
    onlineEndTime:'2016-8-6 13:48:10'
},{
    name:'14:00',
    onlineStartTime:'2016-8-6 15:47:00',
    onlineEndTime:'2016-8-6 16:48:10'
},{
    name:'16:00',
    onlineStartTime:'2016-8-6 16:47:00',
    onlineEndTime:'2016-8-6 17:48:10'
},{
    name:'18:00',
    onlineStartTime:'2016-8-6 18:47:00',
    onlineEndTime:'2016-8-6 19:48:10'
}];

//活动规则数据结构
var config6 = {
    ruleContent:'1.同一个手机号/同一个设备号/同一个支付账号（包括但不限于同一银行卡/同一支付宝/同一个微信等等）均视为同一用户<br>2.活动商品仅支持在线支付订单<br>3.活动商品可以使用红包，但不与满减活动共享<br>4.活动商品仅支持送货上门订单<br>5.活动商品不限购<br>本次活动最终解释权归闪电购所有<br>'
}

//活动图片
var config7 = {
    src:"http://imgsize.52shangou.com/img/n/07/12/1468294628638_532.jpg",
    width:'750',
    height:'500'
}
//活动优惠券数据结构
var config8 = {
    hongbaoSetId:'4120,4121'
};

//活动分隔栏数据结构
var config9 = {
    text:'限时限购，速度抢',
    align:'left'
}

//领取红包
var config10 = {
    imgUrl:'http://imgsize.52shangou.com/img/n/09/06/1473140796270_9172.jpg,http://imgsize.52shangou.com/img/n/09/06/1473140796270_9172.jpg,http://imgsize.52shangou.com/img/n/09/06/1473140796270_9172.jpg',
    ruleArr:'仅限北京/上海/广州/深圳/杭州使用;同一手机号限领一次',
    bgColor:'#FEE100',
    hongbaoCode:'dyj01',
    IOSDownload:'',
    AndroidDownload:'',
    moduleId:'qwer',
    isColorLight:1
}



var config11 = {
    imgUrl:'http://imgsize.52shangou.com/img/n/08/12/1470981048167_1164.png'
}

var config12 = {
    list:[{
        name:"商品类目1",
        relevanceModule:"xxx"
    },
    {
        name:"商品类目2",
        relevanceModule:"000"
    },
    {
        name:"商品类目3",
        relevanceModule:"111"
    },
    {
        name:"商品类目4",
        relevanceModule:"222"
    }]
}

var config13 = {
    "activityId":'1000',
    "activityType":"timeline",
    'chooseBtn':'case1',
    "moduleId":'111',
}

var config14 = {
    "activityId":'1001',
    "activityType":"hotItem",
    'chooseBtn':'case1',
    "moduleId":'222',
}

var config15 = {
    list:[{
        name:"10:00",
        onlineStartTime:'10:00:00',
        relevanceModule:"xxx"
    },
    {
        name:"11:21",
        onlineStartTime:'11:21:00',
        relevanceModule:"000"
    },
    {
        name:"14:00",
        onlineStartTime:'14:00:00',
        relevanceModule:"111"
    },
    {
        name:"16:00",
        onlineStartTime:'16:00:00',
        relevanceModule:"qwer"
    }
    ],
    moduleId:'timeline',
    startDate:'2016-9-8',
    endDate:'2016-9-10'
}

var config16 = {
    slider:[{
        imgUrl:'http://imgsize.52shangou.com/img/n/08/07/1470547941690_9847.jpg',
        jumpLink:'http://www.baidu.com/'
    },{
        imgUrl:'http://imgsize.52shangou.com/img/n/08/07/1470547941690_9847.jpg',
        jumpLink:'http://www.baidu.com/'
    },{
        imgUrl:'http://imgsize.52shangou.com/img/n/08/07/1470547941690_9847.jpg',
        jumpLink:'http://www.baidu.com/'
    },{
        imgUrl:'http://imgsize.52shangou.com/img/n/08/07/1470547941690_9847.jpg',
        jumpLink:'http://www.baidu.com/'
    }],
    height:'480',
    moduleId:'3333'
}

var config111 = {
    data:{
     "ImgList":["http://imgsize.52shangou.com/img/n/09/19/1474262432948_4975.png","http://imgsize.52shangou.com/img/n/09/19/1474262433322_8186.png","http://imgsize.52shangou.com/img/n/09/19/1474262433565_4353.png"],
    "linkList":{
        "1":{"key":"1","link":"https://www.baidu.com?spm=sss","pos":{"left":"81.5","top":"223.5","width":"257","height":"133"}},
        "2":{"key":"2","link":"https://www.taobao.com?spm=ssssdad","pos":{"left":"82.5","top":"428.5","width":"243","height":"164"}},"length":"0"},
        "cell":"340",
        "pageWidth":"375",
        "scale":"0.872093023255814",
        "source":"http://imgsize.52shangou.com/img/n/09/19/1474262422681_9883.png"       
    }

    }

var AllComponents = React.createClass({
    componentDidMount:function() {

        setTimeout(function() {
            img.fireLazyload();  
            document.body.style.backgroundColor = templateChoose.bodyBg.backgroundColor;
            lib.setNativeBar();//tspbar设置
            lib.bindDisplayBack();//回退触发函数绑定 例如从购物车页面减商品 回退到有购物车的商品

            var event = document.createEvent('HTMLEvents');  
            event.initEvent("ondataavailable", true, true);  
            event.eventType = 'message';  
            document.dispatchEvent(event); 

        },500);

    },

    //有导航类目的
    // <TopBanner config={config10} />
    // <Timeline config={config7} />
    // <Navigation config = {config5} />
    // <BoomFoodItemList config = {config1} />
    // <ShoppingCarts configCoupon = {configCoupon} />
    // <Navigation config = {config6} />
    // <TuijianFood config = {config2} />
    // <PicTextMix720x380 config = {config3} />
    // <RuleContent config={config9}/>

    //时间轴的
    // <TopBanner config={config7} />
    // <Timeline config={config5} />
    // <Coupon config={config8} />
    // <SeparatorBar config={config9}/>
    // <BoomFoodItemList config = {config3} />
    // <TuijianFood config = {config3} />
    // <PicTextMix650x650 config = {config3} />
    // <PicTextMix720x380 config = {config3} />
    // <ShoppingCarts />
    // <RuleContent config={config6} />



    //RedEnvelope 红包领取的
    //<RedEnvelope config={config10} />


    //PrizeDraw 抽奖
    // <PrizeDraw config={config11} />

    // config1 普通商品数据，config2 有导航类目商品数据，config3 时间轴商品，
    // config4导航类目自身数据，config5时间轴本身的数据，config6活动规则数据，config7活动图片数据，
    // config8活动优惠券数据，config9活动分隔栏数据,config10红包配置

    //楼层导航
    // <FloorNav config={config12} />
    // <BoomFoodItemList config = {config3} />
    // <TuijianFood config = {config2} />
    // <BoomFoodItemList config = {config13} />
    // <BoomFoodItemList config = {config14} />

    //时间轴新
    // <TimelineMoudle config = {config15}/>
    // <BoomFoodItemList config = {config3} />
    // <TuijianFood config = {config2} />
    // <BoomFoodItemList config = {config13} />
    // <BoomFoodItemList config = {config14} />

    // 轮播
    // <SliderArea config = {config16} />

    // 领取组件
    // <Dole config={config10} />

    // 热点图
    // <HotPoint config={config111}/>

    //需要手动添加的
    render: function() {
        return (
            <div className = "AllComponents">
                <HotPoint config={config111}/>
            </div>
        );
    //需要手动添加的
    }

});

var Wrap = React.createClass({
    getInitialState:function() {
        return AppStores.data
    },
    componentDidMount: function() {
        AppStores.addChangeListener(this._onChange);
        AppActions.mtop();
    },
    componentWillUnmount: function() {
        AppStores.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(AppStores.data);
    },
    render:function() {
        if(!this.state.requestOver && this.state.error) {
            return (
                <div className="long">
                    <Error error={this.state.error} />
                </div>
            )
        }else if(!this.state.requestOver) {
            return (
                <div className="long">
                </div>
            )
        }else {
            return (
                <div className="long">
                    <AllComponents />
                    <Toast/>
                </div>
            )
        }

    }
});
window.AppActions = AppActions;
window.addEventListener('load',function() {
    React.render(
      <Wrap />,
      document.getElementById('content')
    );
},false);
