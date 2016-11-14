var EventEmitter  = require('events').EventEmitter;
var assign = require('lib/object-assign');
var AppDispatcher = require('dispatch');
var lib = require('lib/index.js');
var EVENT_CHANGE = 'store::change';
var AppStoresForPicTextMix = assign({}, EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(EVENT_CHANGE, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(EVENT_CHANGE, callback);
  },
  emitChange: function() {
    this.emit(EVENT_CHANGE);
  },
});

AppDispatcher.register(function(payload) {
  var action = payload;
  switch(action.actionType) {
    case "setPicTextListData720x380":
      return setPicTextListData720x380(action.params);
    default:
      return true;
  }
});

function setPicTextListData720x380(params) {
  
    var hotItem = params && params.hotItem;
    if(hotItem) {
        var localData = GlobalCart.getCartData();
        if(localData){
            hotItem.forEach(function(v,j) {
                var itemId = v.id;
                if(localData[itemId] && localData[itemId].count >= 0){
                    v.cartNum = localData[itemId].count;
                }else {
                    v.cartNum = 0;
                }

            });
        }
        params.hotItem = hotItem;
    }

    AppStoresForPicTextMix.data = params;
    AppStoresForPicTextMix.emitChange();
}


AppStoresForPicTextMix.initData = {
    requestOver:false,
    error:{
      display:{display:"none"},
      text:{
        p1:"",
        p2:""
      }
    },
    loading:{
      display:"block"
    }
}

module.exports = AppStoresForPicTextMix;
