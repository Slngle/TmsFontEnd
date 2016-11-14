var AppDispatcher = require('dispatch');
var AppActions = {
    setListData: function(params) {
        AppDispatcher.dispatch({
            actionType: "setListData",
            params: params
        });
    }
};

module.exports = AppActions;