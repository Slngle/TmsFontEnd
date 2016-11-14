var EventEmitter  = require('events').EventEmitter;
var assign = require('lib/object-assign');
var AppDispatcher = require('dispatch');
var lib = require('lib/index.js');
var EVENT_CHANGE = 'store::change';
var AppStoresForFloorNav = assign({}, EventEmitter.prototype, {
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
    case "setFloorNav":
      return setFloorNav(action.params);
    default:
      return true;
  }
});

function setFloorNav(params) {
    AppStoresForFloorNav.data = params;
    AppStoresForFloorNav.emitChange();
}


AppStoresForFloorNav.initData = {
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

module.exports = AppStoresForFloorNav;
