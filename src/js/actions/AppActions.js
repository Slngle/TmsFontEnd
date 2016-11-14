var AppDispatcher = require('dispatch');

var AppActions = {
    mtop: function(params) {
        AppDispatcher.dispatch({
            actionType: "mtop",
            params: params
        });
    },
    showError: function(params) {
        AppDispatcher.dispatch({
            actionType: "showError",
            params: params
        });
    }
};

module.exports = AppActions;