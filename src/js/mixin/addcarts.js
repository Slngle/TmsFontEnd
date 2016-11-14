var lib = require('../lib/index');
var windowlib = window.lib;
var PAGE_OS = lib.navigator();
var detailURL = lib.returnH5Host(true);
var jsonPrefix = lib.returnHost();
var jsonPrefixForHttps = lib.returnHost({forHttps:true});
var loginUrl = 'buyer/personalcenter/php/o2o/login/login_in_app.html?page=new-app-page&spm=a_shandiangou.b_special_two.c_.d_';
var setSpm = lib.spm();
var endLeft = 0;
var endTop = 0;
var userStatus = false;
var userInfo = null;
//推荐特殊商品加购
var canRequestTuijian = true;

var addCarts = {
    addCartTuijian:function(params) {
        var item = params.item;
        var evtTarget = params.ev.target;//event
        var dataAll = params.dataAll;
        var callback = params.callback;
        if(params && params.specialFood) {
            var cartNum = item.cartNum || 0;
            // 最小起订量逻辑处理
            if(item.orderLimit > 0 && cartNum < item.orderLimit) {
                cartNum = item.orderLimit;
            }
            else{
                cartNum ++;
            }
            this.addSpecialItemToCart({item:item,setId:params.setId,cartNum:cartNum,evtTarget:evtTarget,dataAll:dataAll,type:params.type,callback:callback});
        }else {
            this.addNormal({item:item,cartNum:cartNum,setId:params.setId,evtTarget:evtTarget,dataAll:dataAll,type:params.type,callback:callback});
        }
    },
    addSpecialItemToCart:function(params) {
        var self = this;
        if(userStatus) {
            this.userRightsTuijian(params);
        }
        else {
          if(canRequestTuijian) {
            canRequestTuijian = false;
            //获取用户信息
            windowlib.ajax({
              url:jsonPrefix + 'member/getUserInfo.do',
              time:'15000',
              dataType:'jsonp',
              data:{},
              success:function(data) {
                  canRequestTuijian = true;
                  if(data.status) {
                      userInfo = data.userInfo;
                      userStatus = true;
                      self.userRightsTuijian(params);
                  } else {
                      window.location.href = jsonPrefixForHttps + loginUrl;
                  }
              },
              error:function(data) {
                canRequestTuijian = true;
              }
            });
          }
        }
    },
    addNormal:function(params) {
        var cartNum = params.item.cartNum || 0;
        var item = params.item;
        var dataAll = params.dataAll;
        if(item.orderLimit > 0 && cartNum < item.orderLimit) {
            cartNum = item.orderLimit;
        }else {
            cartNum++;
        }

        if(cartNum > item.quantity) {
          setTimeout(function() {
              var data = {
                type:'alert',
                style:{'display':'-webkit-box'},
                content:"库存不足",
              }
              AppActionsForToast.setToast(data);
          },0);
          return;
        }
        if(item.buylimit && cartNum > item.buylimit) {
           setTimeout(function() {
              var data = {
                type:'alert',
                style:{'display':'-webkit-box'},
                content:"抱歉，已超过购买上限，先挑点别的吧~",
              }
              AppActionsForToast.setToast(data);
           },0);
          return;
        }
        if(item.cartNum > 999) {
            setTimeout(function() {
                var data = {
                  type:'alert',
                  style:{'display':'-webkit-box'},
                  content:"抱歉，已超过购买上限，先挑点别的吧~",
                }
                AppActionsForToast.setToast(data);
            },0)
            return;
        }

        GlobalCart.setItem(item.id,item.shopId,cartNum);
        item.cartNum = cartNum;
        this.reloadTjCartsNum({hotItems:dataAll,type:params.type,callback:params.callback});
        window.AppActionsForShoppingCarts && this.reloadCartsTuijian({hotItems:dataAll,type:params.type});
        window.AppActionsForShoppingCarts && this.cartsAnimation(params.evtTarget);        
    },
    updateTuijianUI:function(params) {
        var item = params.item;
        var cartNum = params.cartNum;
        if(cartNum > item.quantity) {
            setTimeout(function() {
              var data = {
                type:'alert',
                style:{'display':'-webkit-box'},
                content:"库存不足",
              }
              AppActionsForToast.setToast(data);          
            },0);
            return;

        }
        if(item.buylimit && cartNum > item.buylimit) {
          setTimeout(function() {
              var data = {
                type:'alert',
                style:{'display':'-webkit-box'},
                content:"抱歉，已超过购买上限，先挑点别的吧",
              }
              AppActionsForToast.setToast(data);
          });
          return;
        }
        if(item.cartNum > 999) {
          setTimeout(function() {
              var data = {
                type:'alert',
                style:{'display':'-webkit-box'},
                content:"抱歉，已超过购买上限，先挑点别的吧",
              }
              AppActionsForToast.setToast(data);        
          },0);
          return;
        }
        GlobalCart.setItem(item.id,item.shopId,cartNum);
        item.cartNum = cartNum;
        this.reloadTjCartsNum({hotItems:params.dataAll,type:params.type,callback:params.callback});
        this.reloadCartsTuijian({hotItems:params.dataAll,type:params.type});
        this.cartsAnimation(params.evtTarget);
        GlobalCart.spm(item.id,'a_shandiangou.b_activeity_full_reduction.c_.d_')
    },
    userRightsTuijian:function(params) {
        var self = this;
        if(!params) {
            console.log('请输入参数');
        }
        var shopcarts = GlobalCart.getCartData();//localStorage.getItem(key_carts);
        if (shopcarts != null) {
            try {
              var carts = JSON.parse(shopcarts);
            }
            catch(ex) {
              var carts = shopcarts;
            }
        } else {
            var carts = {};
        }

        var shopCartItemId = carts;
        var shopCartItemIds = '';
        for(var i in shopCartItemId){
            if(shopCartItemId[i] && typeof shopCartItemId[i] == 'object'){
                if(shopCartItemIds == ''){
                    shopCartItemIds = i+'-'+shopCartItemId[i].count;
                }else{
                    shopCartItemIds += ','+i+'-'+shopCartItemId[i].count;
                }
            }
        }

        windowlib.ajax({
            url: jsonPrefix + "market/api/specialPrice/checkSpecialPrice.jsonp",
            data: {
                mobile:userInfo.mobile,
                setId:params.setId,
                itemId:params.item.id,
                //userToken:userInfo.token,
                shopCartItemIds:shopCartItemIds
            },
            dataType:"jsonp",
            success: function (data) {

                if( data.status == true ) {
                    self.updateTuijianUI({item:params.item,evtTarget:params.evtTarget,cartNum:params.cartNum,dataAll:params.dataAll,type:params.type,callback:params.callback});                
                } else if(data.responseCode == 9999) {
                    var limit = data.message;
                    // confirmR('','本活动特价商品限购'+limit+'件<br>多添加的特价商品需按原价购买','取消添加','继续添加',function(){
                    //     addCarts({itemId:params.itemId,shopId:params.shopId});
                    // });
                    var data = {
                      type:'confirm',
                      style:{'display':'-webkit-box'},
                      content:('本活动特价商品限购'+limit+'件 多添加的特价商品需按原价购买') || '',
                      btnConfirmLeftFn:function() {
                          self.updateTuijianUI({item:params.item,evtTarget:params.evtTarget,cartNum:params.cartNum,dataAll:params.dataAll,type:params.type,callback:params.callback});
                      }
                    }
                    AppActionsForToast.setToast(data);

                } else{
                    var data = {
                      type:'alert',
                      style:{'display':'-webkit-box'},
                      content:data.message || '添加失败',
                    }
                    AppActionsForToast.setToast(data);
                }
            }
        });
    },
    reloadTjCartsNum:function(params) {
        var hotItems = params && params.hotItems;
        var localData = GlobalCart.getCartData();
        if(localData){
            hotItems.forEach(function(v,j) {
                var itemId = v.id;
                if(localData[itemId] && localData[itemId].count >= 0){
                    v.cartNum = localData[itemId].count;
                }else {
                    v.cartNum = 0;
                }

            });
        }

        ////callback的地方
        params && params.callback && params.callback({
            hotItem:hotItems
        });
    },
    cartsAnimation:function(element) {
        if(!element) {
          console.log('无效的点击element');
          return;
        }
        if(endLeft==0 && endTop==0) {
          var shoppingCart = document.getElementById("shoppingCart");
          endLeft = shoppingCart && shoppingCart.offsetLeft + shoppingCart.offsetWidth/2;
          endTop = shoppingCart && shoppingCart.offsetTop + shoppingCart.offsetHeight/2;
        }

        var left = element.getBoundingClientRect().left +  element.offsetWidth/2;
        var top = element.getBoundingClientRect().top + element.offsetHeight/2 - 20;
        var oDiv = document.createElement('div');
        oDiv.className = 'redCircle';
        oDiv.innerHTML = '1';
        oDiv.style.WebkitTransform = "translate3d("+left+"px,"+(top-10)+"px,0px)";
        document.body.appendChild(oDiv);

        var animateDom = document.querySelectorAll('.redCircle');
        var animateDomSize = animateDom && animateDom.length;
        var movAction = animateDom && animateDom[animateDomSize - 1];

        setTimeout(function() {
            movAction.style.WebkitTransform = "translate3d("+endLeft+"px,"+endTop+"px,0px)";
        },100);

        setTimeout(function(){document.body.removeChild(movAction)},800);      
    },
    delCarts:function(params) {
        var item = params.item;
        var cartNum = item.cartNum || 0;
        // 最小起订量逻辑处理
        if(item.orderLimit > 0 && cartNum <= item.orderLimit){
            cartNum = 0;
        }
        else{
            if(cartNum > 0){
                cartNum --;
            }
        }
        // 最小起订量逻辑处理-end
        GlobalCart.setItem(item.id,item.shopId,cartNum);
        item.cartNum = cartNum;
        this.reloadTjCartsNum({hotItems:params.dataAll,type:params.type,callback:params.callback});
        window.AppActionsForShoppingCarts && this.reloadCartsTuijian({hotItems:params.dataAll,type:params.type});      
    },
    reloadCartsTuijian:function(params) {
        var empty_carts = {};
        var shopcarts = GlobalCart.getCartData();//localStorage.getItem(key_carts);
        if (shopcarts != null) {
            try {
              var carts = JSON.parse(shopcarts);
            }
            catch(ex) {
              var carts = shopcarts;
            }
        } else {
            var carts = {};
        }
        this.updateCarts({carts:carts});
        lib.bindDisplayBack();
    },
    updateCarts:function(params) {
        var itemCount = 0;
        var carts = params.carts;
        // var totalPrice = 0;
        //是否需要按类目统计数量等？暂时不做。
        for( var id in carts ) {
            var cart = carts[id];
            if( cart !== null && typeof cart == "object" ) {
                itemCount = itemCount + cart.count;
                // totalPrice = totalPrice + cart.count * cart.price;
            }
        }
        // carts.totalPrice = totalPrice;
        carts.itemCount = itemCount;
        var value = JSON.stringify(carts);
        GlobalCart.saveCartData(JSON.parse(value));

        setTimeout(function() {
            window.AppActionsForShoppingCarts && AppActionsForShoppingCarts.setCartNum({cartNum:carts.itemCount});
        },1);
    },
    tuijianLink:function(params) {
        if(params && params.type == 'tuijian') {
            var spmLink = setSpm.foodLink;
        }else if(params && params.type == 'boom') {
            var spmLink = setSpm.tuijianLeftLink;
        }
        if ((PAGE_OS.compareVersion(PAGE_OS.appVersion, '3.2.0')>=0 && PAGE_OS.isIOS) || (PAGE_OS.compareVersion(PAGE_OS.appVersion, '3.2.8')>=0 && PAGE_OS.isAndriod)) {
        //链接后加spm
            location.href = detailURL+'/commodity/detail.html?page=new-app-page&tspBar=true&native_cache=true&itemId='+params.id+'&shopIds='+(lib.getByUrl("shopIds") || '')+ '&spm=' + spmLink
        } else {
        //native埋点
            try {
                bridge.statistics('', 'clickMonitor', JSON.stringify({
                    Referrer: location.href + '&spm='+ (lib.getByUrl("spm")||''),
                    spm: '/commodity/detail.html?page=new-app-page&tspBar=true&native_cache=true&itemId='+params.id+'&shopIds='+(lib.getByUrl("shopIds") || '')+ '&spm=' + spmLink
                }),2);
            } catch (ex) {
                console.log(ex)
            }
            location.href = detailURL + '/commodity/detail.html?page=new-app-page&tspBar=true&native_cache=true&itemId='+params.id+'&shopIds='+(lib.getByUrl("shopIds") || '')+ '&spm=' + spmLink
        }  
    }
}

module.exports = addCarts;