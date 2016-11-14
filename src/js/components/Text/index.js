var lib = require('lib/index');
var PAGE_OS = lib.navigator();
var Text = React.createClass({
	getRightClassName:function() {
		if(PAGE_OS.isApp) {
			if(lib.getByUrl('tspBar')=='true') {
			if(PAGE_OS.isIOS) {
					return "iosPos";
				} else {
					return "androidPos";
				}
			}else {
				return "normal-posdiv";
			}
		} else {
			return "normal-posdiv";
		}
	},
	render: function() {
      	var config = this.props.config;
		var text = config && config.text || '';
		var moduleId = config && config.moduleId; 
		var hidden = config && config.hidden;
		var getRightClassName = this.getRightClassName();

		if(hidden) {
			var strHidden = {
				display:'none'
			}
		}else {
			var strHidden = {
			}	
		}

		return (
			<div className="Text-wrap">
				<div className={getRightClassName} id={moduleId+'maodian'}></div>
				<div className="Text" dangerouslySetInnerHTML={{__html: text}} style={strHidden}>
				</div>
			</div>
		);
	}

});

module.exports = Text;