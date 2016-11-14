var AppDispatcher = require('dispatch');
var AppActions = {
    setCountdown: function(params) {
        AppDispatcher.dispatch({
            actionType: "setCountdown",
            params: params
        });        
    }
};

module.exports = AppActions;