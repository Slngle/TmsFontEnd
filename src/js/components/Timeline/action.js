var AppDispatcher = require('dispatch');
var AppActions = {
    setTimeline: function(params) {
        AppDispatcher.dispatch({
            actionType: "setTimeline",
            params: params
        });
    },
    letTimelineUpDateSelf: function(params) {
        AppDispatcher.dispatch({
            actionType: "letTimelineUpDateSelf",
            params: params
        });
    }
};

module.exports = AppActions;