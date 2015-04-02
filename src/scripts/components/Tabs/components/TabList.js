/** @jsx React.DOM */
var React = require('react');

var Icon = require('../../Icon');

module.exports = React.createClass({
	displayName: 'TabList',

	getInitialState: function () {
		var tabIds = [];
		var panelIds = [];

		return {
			selectedIndex: this.props.selectedIndex,
			focus: this.props.focus,
			tabIds: tabIds,
			panelIds: panelIds,
			showPanel: 'KDM'
		};
	},

	render: function () {
		var state = this.state;
		console.log(state.showPanel); 
		return (
			<div className="adv-Tabs-controls">
				<ul
					{...this.props}
					role="tablist">
					{this.props.children}
				</ul>

				<Icon name="caret-bottom" className="adv-Icon--reversed"/>
			</div>
		);
	},

/* KDM testing TabList click */
	handleClick: function (e) {
		var node = e.target;
		do {
			if (isTabNode(node)) {
				var index = [].slice.call(node.parentNode.children).indexOf(node);
				var show = index === this.state.selectedIndex ? !this.state.showPanel : true;
				this.setSelected(index, true, show);
				return;
			}
		} while (node = node.parentNode);
	}

});
