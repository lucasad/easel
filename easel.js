/** @jsx React.DOM */
(function(module) {
var Canvas = React.createClass({displayName: 'Canvas',
	getInitialState: function() {
		return {old: {x:0,y:0},
			oldMid: {x:0,y:0}};
	},
	mousedown: function(evt) {
		var node = this.getDOMNode();
		var coords =  {x:evt.pageX-node.offsetLeft, y:evt.pageY-node.offsetTop};
		var mid = {x: coords.x+coords.x>>1, y: coords.y+coords.y>>1 }
		this.setState({old: coords, current:coords, oldMid: mid, drawing: true });
	},
	mouseup: function() {
		this.setState({drawing: false});
	},
	mousemove: function(evt) {
		var node = this.getDOMNode();
		this.setState({ current: {x:evt.pageX-node.offsetLeft, y:evt.pageY-node.offsetTop}});
	},
	getMid: function(coords) {
		return {
			x: this.state.old.x + coords.x>>1,
			y: this.state.old.y + coords.y>>1
		}
	},
	componentDidMount: function() {
		var ctx = this.getDOMNode().getContext('2d');
		ctx.lineWidth = this.props.size;
		ctx.strokeStyle = this.props.color;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		requestAnimationFrame(this.draw.bind(this, ctx));
	},
	componentDidUpdate: function() {
		var ctx = this.getDOMNode().getContext('2d');
                ctx.lineWidth = this.props.size;
                ctx.strokeStyle = this.props.color;
	},
	draw: function() {
		requestAnimationFrame(this.draw);
		var ctx = this.getDOMNode().getContext('2d');
		if(this.state.drawing) {
			var currentMid = this.getMid(this.state.current);
			ctx.beginPath();
			ctx.moveTo(currentMid.x, currentMid.y);
			ctx.quadraticCurveTo(this.state.old.x, this.state.old.y, this.state.oldMid.x,this.state.oldMid.y);
			ctx.stroke()
			this.setState({old: this.state.current, oldMid: currentMid});
		}
	},
	render: function() {
		return React.DOM.canvas({onMouseDown: this.mousedown, onMouseUp: this.mouseup, onMouseMove: this.mousemove, width: this.props.width, height: this.props.height})
	}
});
var Controls = React.createClass({displayName: 'Controls',
	changeColor: function(evt) {
		var color = evt.target.value;
		this.props.setColor(color);
	},
	changeSize: function(evt) {
		var size = evt.target.valueAsNumber;
			this.props.setSize(size);
	},
	render: function() {
		var saveBtn = this.props.save ? React.DOM.button({onClick: this.props.save}, "Save") : null;
		return (React.DOM.div(null, 
				React.DOM.input({type: "color", ref: "color", value: this.props.color, onChange: this.changeColor}), 
				React.DOM.input({type: "range", ref: "size", value: this.props.size, onChange: this.changeSize}), 
				saveBtn
			))
	}
});
module.easel = React.createClass({displayName: 'easel',
	getInitialState: function() {
		return {color: "#f23e3e", size: 3}
	},
	setSize: function(size) {
		this.setState({size:size});
	},
	setColor: function(color) {
		this.setState({color:color});
	},
	save: function() {
		if(this.props.onSave) this.refs.canvas.getDOMNode().toBlob(this.props.onSave, this.props.format);
	},
	render: function() {
		return (React.DOM.div(null, 
				Controls({setColor: this.setColor, setSize: this.setSize, save: this.props.onSave?this.save:null, color: this.state.color, size: this.state.size}), 
				Canvas({color: this.state.color, size: this.state.size, width: this.props.width||640, height: this.props.height||480, ref: "canvas"})
			))
	}
});
})(window);
