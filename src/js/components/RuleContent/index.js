import style from './index.css';
var Rule = React.createClass({
	render:function() {
		var config = this.props.config;
		var hidden = config.hidden;
		var moduleId = config.moduleId;
		var templateChoose = window.templateChoose;
		var ruleContentT = templateChoose && templateChoose.ruleContent || {};
		var ruleContent = config && config.ruleContent;
		if(ruleContent.match('\r\n')) {
			var arrData =  ruleContent.split('\r\n');
		}else {
			var arrData =  ruleContent.split('<br>');
		}
		var pList = arrData.map(function(data) {
			data = data.replace('<br>',"");
			return (<p className="rule-content-text">{data}</p>)
		});
		
		return (
			<div className="rule" style={{color:ruleContentT.color}}>
				<div className="rule-in">
					{ruleContent?<h1 className="rule-title">活动规则</h1>:<div></div>}
					<div className="rule-content">
						{pList}
					</div>			 
					<p className="phone"> 
						<span>客服热线：</span>
						<a href="tel:0571-28277599" className="phone-number">0571-28277599</a>
					</p>
				</div>
			</div>
		)
	}
});

 module.exports = Rule;