import style from './index.css';
var AppActions = require('./action');
var AppStoresForShoppingCart = require('./store');
var lib = require('lib/index');
var PAGE_OS = lib.navigator();
var jsonPrefixForHttps = lib.returnHost({forHttps:true});
var ShoppingCart = React.createClass({
    getInitialState:function() {
        var shopcarts = GlobalCart.getCartData();
        var itemCount = 0;
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

        for( var id in carts ) {
            var cart = carts[id];
            if( cart !== null && typeof cart == "object" ) {
                itemCount = itemCount + cart.count;
            }
        }

        return {
            cartNum:itemCount
        }
    },
    componentDidMount: function() {
        var self = this;
        AppStoresForShoppingCart.addChangeListener(this._onChange);

        var fastNode = document.getElementById("shoppingCart");
        if(fastNode) {
            var fast = SGLib.FastClick(fastNode);
        }

        document.addEventListener('updateItemBuyNum', function (e) {
            var shopcarts = GlobalCart.getCartData();
            var itemCount = 0;
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

            for( var id in carts ) {
                var cart = carts[id];
                if( cart !== null && typeof cart == "object" ) {
                    itemCount = itemCount + cart.count;
                }
            }
            self.setState({
                cartNum:itemCount
            })
        }, false);
    },
    componentWillUnmount: function() {
        AppStoresForShoppingCart.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(AppStoresForShoppingCart.data);
    },
    gotoShopingcart:function() {
        if(window.inWeiChat) {
            instance.showTipLayer();
        }else{
            //去购物车逻辑
            if ((PAGE_OS.compareVersion(PAGE_OS.appVersion, '3.2.0')>=0 && PAGE_OS.isIOS) || (PAGE_OS.compareVersion(PAGE_OS.appVersion, '3.2.8')>=0 && PAGE_OS.isAndriod)) {
            //链接后加spm
              GlobalCart.goCartPage(lib.spm().addCartLink);
            } else {
            //native埋点
                try {
                    bridge.statistics('', 'clickMonitor', JSON.stringify({
                        Referrer: location.href + '&spm='+ (lib.getByUrl('spm')||''),
                        spm: '/trade/cart.html?page=new-app-page&native_cache=true' + '&spm=' + lib.spm().addCartLink
                    }),2);
                } catch (e) {

                }
                GlobalCart.goCartPage(lib.spm().addCartLink);
            }            
        }
    },
    render: function() {
        var cartNum = this.state.cartNum || 0;
        var styles = cartNum!=0?{ "visibility": "visible" }:{ "visibility": "hidden" };
        return (
            <div id="shoppingCart" className="shoppingCart" onClick={this.gotoShopingcart}>
                <span id="shoppingCartNumber" className="shoppingCartNumber" style={styles}>{cartNum}</span>
            </div>
        )
    }

});
window.AppActionsForShoppingCarts = AppActions;
module.exports = ShoppingCart;