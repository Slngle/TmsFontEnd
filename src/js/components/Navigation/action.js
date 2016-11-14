var AppDispatcher = require('dispatch');
var AppActions = {
    setNavGation: function(params) {
        AppDispatcher.dispatch({
            actionType: "setNavGation",
            params: params
        });
    }
};

module.exports = AppActions;