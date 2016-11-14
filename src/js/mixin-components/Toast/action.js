var AppDispatcher = require('dispatch');
var AppActions = {
    getOver: function(params) {
        AppDispatcher.dispatch({
            actionType: "getOver",
            params: params
        });
    },
    setToast: function(params) {
        AppDispatcher.dispatch({
            actionType: "setToast",
            params: params
        });
    },    
    showLoading: function(params) {
        AppDispatcher.dispatch({
            actionType: "showLoading",
            params: params
        });
    },
    hideLoading: function(params) {
        AppDispatcher.dispatch({
            actionType: "hideLoading",
            params: params
        });
    },
    setRightWrong: function(params) {
        AppDispatcher.dispatch({
            actionType: "setRightWrong",
            params: params
        });        
    }
};

module.exports = AppActions;