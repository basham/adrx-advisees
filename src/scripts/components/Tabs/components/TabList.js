/** @jsx React.DOM */
var React = require('react');

var Icon = require('../../Icon');

module.exports = React.createClass({
	displayName: 'TabList',

	render: function () {
		return (
			<div className="adv-Tabs-controls">
				<ul
					{...this.props}
					role="tablist">
					{this.props.children}
				</ul>
				<Icon name="caret-bottom"/>
			</div>
		);
	}
});
