import style from './index.css';
var lib = require('lib/index');
var GoUp = React.createClass({
	componentDidMount:function() {
    	var self = this; 
        setTimeout(function() {
        	lib.throttle(self.scrollEvent,200)();
        },300);
    },
	goTop:function() {
		lib.changeScrollTop({distance:0,speed:8});
	},
	scrollEvent:function() {
    	var goUp = document.querySelector('.goUp');
    	window.addEventListener('scroll',function() {
    		window.scroll = true;
    		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    		if(scrollTop>1000) {
    			goUp.classList.remove('hidden');
    		}else {
    			goUp.classList.add('hidden');
    		}
    	},false);
    },
	render: function() {
		return (
			<div className="goUp hidden" onClick={this.goTop}>

			</div>
		);
	}

});

module.exports = GoUp;