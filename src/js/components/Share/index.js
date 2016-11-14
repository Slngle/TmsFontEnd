var lib = require('lib/index');
var Share = React.createClass({
	componentDidMount: function() {
		var isShow = lib.getByUrl('isShow');
		var PAGE_OS = lib.navigator();
		if(!PAGE_OS.isApp && PAGE_OS.isWeiChat) {
		    window.inWeiChat = true;
		} else if(!PAGE_OS.isApp && isShow != 1) {
		    // window.inWeiChat = true;
		    // var activityId = lib.getByUrl('activityId') || 0;
		    // var setId = lib.getByUrl('setId');
		    // var shopIds = lib.getByUrl('shopIds');
		    // var params = {activityId:activityId && Number(activityId),setId:setId && Number(setId),tspBar:true,shopIds:shopIds};
		    // params = JSON.stringify(params);
		    // params = encodeURIComponent(params);
		    //window.location.href = '//h5.m.52shangou.com/activity/jump.html?type=7&params='+params;
		    window.location.href = '//h5.m.52shangou.com/activity/jump.html';
		}

		var config = this.props.config;
		var title = config && config.title || "闪电抢购";
		var desc = config && config.desc || "只为帮你省钱、省时、省力，拼的是手速~";
		var imgUrl = config && config.imgUrl || "http://imgsize.52shangou.com/img/n/10/08/50115701795615dee8d59572a7662288c180371abe2a37a14c0489e.png";
		
		var instance = new SGLib.appShare();
	
        instance.init({
            "config":{
                "openShare":true
            },
            "shareData":{
                "title": title,
                "desc": desc,
                "link": location.href,
                "imgUrl": imgUrl
            }
        });
	},
	render:function() {

		return (
			<div>
			</div>
		)
	}
});

 module.exports = Share;