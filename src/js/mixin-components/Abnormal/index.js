    //异常流
    import style from './index.css';
    var Abnormal = React.createClass({
        render:function() {
            var data = this.props.error;
            var displayAttr = data && data.display && data.display.display;

            if(displayAttr != 'none') {
                var imgURL = '//imgsize.52shangou.com/img/n/11/30/1448855302897_6565.png';
            }else {
                var imgURL = '';
            }

            return (
                <div className="error-wrap" style={data.display}>
                    <div className="error-context">
                        <div className="error-img">
                            <img src={imgURL} />
                        </div>
                        <div className="error-text">
                            <p className="p-top">{data.text.p1}</p>
                            <p className="p-bottom">{data.text.p2}</p>
                        </div>
                    </div>
                </div>
            )
        }
    });

    module.exports = Abnormal;