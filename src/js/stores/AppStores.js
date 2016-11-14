var EventEmitter  = require('events').EventEmitter;
var assign = require('lib/object-assign');
var AppDispatcher = require('dispatch');
var lib = require('lib/index.js');
var EVENT_CHANGE = 'store::change';
var AppStores = assign({}, EventEmitter.prototype, {
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
    case "mtop":
      return mtop(action.params);
    case "showError":
      return showError(action.params);
    default:
      return true;
  }
});


// function resetAll(params) {
//     AppStores.data = {
//       requestOver:true,  
//       reset:true
//     }
//     AppStores.emitChange();  
// }

//初始数据获取
function mtop(params) {
    try {
      bridge.hideLoading();
    } catch(ex) {
      console.log(ex);
    }
    AppStores.data = {
      requestOver:true,  
    }
    AppStores.emitChange();  

}

function showError(params) {
    var title = params && params.title || '闪电购提示';
    var message = params && params.message || '商品都没有了，稍后再来试试吧';
    AppStores.data = {
      requestOver:false,
      error:{
          display:{"display":"block"},
          text:{
              p1:title,
              p2:message
          }
      }
    }
    AppStores.emitChange(); 
}

AppStores.data = {
    requestOver:false,
}

module.exports = AppStores;