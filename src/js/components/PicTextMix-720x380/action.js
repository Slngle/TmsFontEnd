var AppDispatcher = require('dispatch');
var AppActions = {
    setPicTextListData720x380: function(params) {
        AppDispatcher.dispatch({
            actionType: "setPicTextListData720x380",
            params: params
        });
    }
};

module.exports = AppActions;