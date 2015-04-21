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
			'adv-Icon--pad': true,
			'adv-Icon--reversed': this.props.showPanel
		});

		return (
			<div className="adv-Tabs-controls">
				<ul
					{...this.props}
					role="tablist">
					{this.props.children}
				</ul>
				<Icon
					className={cn}
					name="chevron-bottom"
					onClick={this.handleClick}/>
			</div>
		);
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
