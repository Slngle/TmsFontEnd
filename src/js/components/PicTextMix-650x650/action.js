var AppDispatcher = require('dispatch');
var AppActions = {
    setPicTextListData650x650: function(params) {
        AppDispatcher.dispatch({
            actionType: "setPicTextListData650x650",
            params: params
        });
    }
};

module.exports = AppActions;