var AppDispatcher = require('dispatch');
var AppActions = {
    setCartNum: function(params) {
        AppDispatcher.dispatch({
            actionType: "setCartNum",
            params: params
        });        
    }
};

module.exports = AppActions;