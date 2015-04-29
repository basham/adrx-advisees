/** @jsx React.DOM */
var React = require('react');
var classNames = require('classnames');
var Icon = require('../../Icon');

module.exports = React.createClass({
	displayName: 'TabList',

	getInitialState: function () {
		return {
			//KDM #28 Receiving showPanel from Tabs parent component
			showPanel: this.props.showPanel
		};
	},

	render: function () {
		var state = this.state;
		var cn = classNames({
			'adv-Tabs-icon': true,
			'adv-Tabs-icon--reversed': this.props.showPanel
		});

		return (
			<div className="adv-Tabs-controls">
				<ul
					className={this.props.className}
					role="tablist">
					{React.Children.map(this.props.children, this.renderChildren)}
				</ul>
				<Icon
					className={cn}
					name="chevron-bottom"
					onClick={this.handleClick}/>
			</div>
		);
	},
	renderChildren: function(child) {
		child.props.expandable = true;
		child.props.expanded = this.props.showPanel;
		return child;
	},

	//KDM 20150403 Passing parm back to Tabs parent component
	handleClick: function (e) {
		e.preventDefault();

		// Call change event handler
		if (typeof this.props.onTogglePanel === 'function') {
			this.props.onTogglePanel();
		}
	}

});
