var AppDispatcher = require('dispatch');
var AppActions = {
    setTimelineMoudle: function(params) {
        AppDispatcher.dispatch({
            actionType: "setTimelineMoudle",
            params: params
        });
    }
};

module.exports = AppActions;