var EventEmitter  = require('events').EventEmitter;
var assign = require('lib/object-assign');
var AppDispatcher = require('dispatch');
var timeInterval = null;
var EVENT_CHANGE = 'store::change';
var lib = require('lib/index');
var AppStoresForTimeline = assign({}, EventEmitter.prototype, {
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
    case "setTimeline":
      return setTimeline(action.params);
    case "letTimelineUpDateSelf":
      return letTimelineUpDateSelf(action.params);
    default:
      return true;
  }
});

function setTimeline(params) {
    AppStoresForTimeline.data = params;
    AppStoresForTimeline.emitChange();
}

function letTimelineUpDateSelf(params) {
    AppStoresForTimeline.emitChange();
}

AppStoresForTimeline.initData = {
    systemTime:'',
    startTime:'',
    endTime:'',
    timeArr:[],
    end:false,
    before:true,
    timeInterval:timeInterval
}

module.exports = AppStoresForTimeline;