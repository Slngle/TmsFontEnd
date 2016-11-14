var AppDispatcher = require('dispatch');
var AppActions = {
    setFloorNav: function(params) {
        AppDispatcher.dispatch({
            actionType: "setFloorNav",
            params: params
        });
    }
};

module.exports = AppActions;