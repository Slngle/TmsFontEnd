    /*
        {
            data:{
                type:// alert confirm toast
                style://外层div样式 {display:none}
                autoClass://额外的classname
                content:// alert 或者 confirm 的标题
                btnAlert://alert按钮的文案
                btnAlertFn://alert按钮按下执行的回调
                btnConfirmLeft://confirm按钮左边的文案
                btnConfirmRight://confirm按钮右边的文案
                btnConfirmLeftFn://左边对应的回调函数
                btnConfirmRightFn://右边对应的回调函数
                havePic://toast是否有图片
            }
        }
    */ 
    import style from './index.css';

    var AppActions = require('./action');
    var AppStoresForToast = require('./store');
    var timer = null;
    var Toast = React.createClass({
        getInitialState:function() {
            return AppStoresForToast.initData
        },
        componentDidMount: function() {
            AppStoresForToast.addChangeListener(this._onChange);
        },
        componentWillUnmount: function() {
            AppStoresForToast.removeChangeListener(this._onChange);
        },
        componentDidUpdate: function() {
            var self = this;
            var state = AppStoresForToast.data;
            if(state && state.data && state.data.type == "toast") {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    AppActions.setToast({
                        style:{"display":"none"}
                    });
                },1500);
            }
        },
        _onChange: function() {
            this.setState(AppStoresForToast.data);
        },
        changeState:function() {
            AppActions.setToast({
                style:{"display":"none"}
            });
        },
        alertFn:function(params) {
            if(params && params.btnAlertFn) {
                params.btnAlertFn();
            }
            this.changeState();
        },
        confirmLeftFn:function(params) {
            if(params && params.btnConfirmLeftFn) {
                params.btnConfirmLeftFn();
            }
            this.changeState();
        },
        confirmRightFn:function(params) {
            if(params && params.btnConfirmRightFn) {
                params.btnConfirmRightFn();
            }
            this.changeState();
        },
        render:function() {
            var data = this.state.data || {};
            var paramsData = {}
            paramsData.type = data.type || 'alert';  // alert confirm toast
            paramsData.style = data.style || {};  //外层div样式 {display:none}
            paramsData.autoClass = data.autoClass || "";//额外的classname
            paramsData.title = data.title || "闪电购提示";// alert 或者 confirm 的标题
            paramsData.content = data.content || "";//alert 或者comfirm 或者 toast 的内容

            paramsData.btnAlert = data.btnAlert || "确认";//alert按钮的文案
            paramsData.btnAlertFn = data.btnAlertFn || null;//alert按钮按下执行的回调

            paramsData.btnConfirmLeft = data.btnConfirmLeft || "确认";//confirm按钮左边的文案
            paramsData.btnConfirmRight = data.btnConfirmRight || "取消";//confirm按钮右边的文案
            paramsData.btnConfirmLeftFn = data.btnConfirmLeftFn || null;//点击confirm按钮左边的回调
            paramsData.btnConfirmRightFn = data.btnConfirmRightFn || null;//点击confirm按钮右边的回调

            paramsData.staticImgWrong = '//imgsize.52shangou.com/img/n/06/23/1466653173482_8984.png';
            paramsData.staticImgRight = '//imgsize.52shangou.com/img/n/04/14/1460608697388_3802.png';
            paramsData.havePic = data.havePic || 'right';

            var self = this;
            if(paramsData.type && paramsData.type == "alert") {
                var btn =   <div className="toast-showBtn">
                                <div className="toast-ok" onClick={function(){self.alertFn(paramsData)}}>
                                    {paramsData.btnAlert}
                                </div>
                            </div>;
            } else if(paramsData.type && paramsData.type == "confirm") {
                 var btn =  <div className="toast-showBtn">
                                <div className="toast-lbtn" onClick={function(){self.confirmLeftFn(paramsData)}}>
                                    {paramsData.btnConfirmLeft}
                                </div>
                                <div className="toast-rbtn" onClick={function(){self.confirmRightFn(paramsData)}}>
                                    {paramsData.btnConfirmRight}
                                </div>
                            </div>;
            } else {
                var btn = <div className="toast-showBtn"></div>;
            }

            if((paramsData.type && paramsData.type == "confirm") || (paramsData.type && paramsData.type == "alert")) {
                return (
                    <div className="toast-wrap" style = {paramsData.style}>
                        <div className="toast-showBox">
                            <div className="toast-showTitle">
                                {paramsData.title}
                            </div>
                            <div className="toast-showMessage">
                                <div className="toast-showMessage-in">
                                     {paramsData.content}
                                </div>
                            </div>
                            {btn}
                        </div>
                    </div>
                )
            } else if(paramsData.type && paramsData.type == "toast") {
                return (
                    <div className="toast-wrap-toast" style = {paramsData.style}>
                        <div className="toast">
                            {paramsData.havePic?<div className="t-icon" style={paramsData.havePic=='right'?{"backgroundImage":"url("+paramsData.staticImgRight+")"}:{"backgroundImage":"url("+paramsData.staticImgWrong+")"}}></div>:""}
                            <p className="t-content">
                                {paramsData.content}
                            </p>
                        </div>
                    </div>
                )
            }else if(paramsData.type && paramsData.type == "loading") {
                return (
                    <div className="toast-wrap-toast" style = {paramsData.style}>
                        <div className="toast-wrap-toast-loading">
                            <div className="toast-loading">
                            </div>
                        </div>
                    </div>
                )
            }
        }
    });
    window.AppActionsForToast = AppActions;
    module.exports = Toast;