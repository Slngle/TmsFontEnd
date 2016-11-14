var EventEmitter  = require('events').EventEmitter;
var assign = require('lib/object-assign');
var AppDispatcher = require('dispatch');
var timeInterval = null;
var EVENT_CHANGE = 'store::change';
var lib = require('lib/index');
var AppStoresForTimelineMoudle = assign({}, EventEmitter.prototype, {
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
    case "setTimelineMoudle":
      return setTimelineMoudle(action.params);
    default:
      return true;
  }
});

function setTimelineMoudle(params) {
    AppStoresForTimelineMoudle.data = params;
    AppStoresForTimelineMoudle.emitChange();
}

AppStoresForTimelineMoudle.initData = {
    systemTime:'',
    startTime:'',
    endTime:'',
    timeArr:[],
    end:false,
    before:true,
    timeInterval:timeInterval
}

module.exports = AppStoresForTimelineMoudle;