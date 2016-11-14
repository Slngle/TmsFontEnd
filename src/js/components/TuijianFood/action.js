var AppDispatcher = require('dispatch');
var AppActions = {
    setTuijianListData: function(params) {
        AppDispatcher.dispatch({
            actionType: "setTuijianListData",
            params: params
        });
    }
};

module.exports = AppActions;