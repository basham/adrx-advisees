/** @jsx React.DOM */
var React = require('react');
var classNames = require('classnames');

var Icon = require('../../Icon');

function syncNodeAttributes(node, props) {
	if (props.selected && !props.disabled) {
		node.setAttribute('tabindex', 0);
		node.setAttribute('selected', 'selected');
		if (props.focus) {
			node.focus();
		}
	} else {
		node.removeAttribute('tabindex');
		node.removeAttribute('selected');
	}
}

module.exports = React.createClass({
	displayName: 'Tab',

	getDefaultProps: function () {
		return {
			focus: false,
			selected: false,
			id: null,
			panelId: null
		};
	},

	componentDidMount: function () {
		syncNodeAttributes(this.getDOMNode(), this.props);
	},

	componentDidUpdate: function () {
		syncNodeAttributes(this.getDOMNode(), this.props);
	},

	render: function () {
		return (
			<li
				{...this.props}
				role="tab"
				id={this.props.id}
				aria-selected={this.props.selected}
				aria-expanded={this.props.expanded}
				aria-controls={this.props.panelId}>
				{this.props.children}
			</li>
		);
	},
	renderIcon: function() {
		if(!this.props.expandable) {
			return null;
		}

		var isSelectedAndExpanded = this.props.selected && this.props.expanded;
		var cn = classNames({
			'adv-Tabs-expandedIcon': true,
			'adv-Tabs-expandedIcon--selected': this.props.selected,
			'adv-Tabs-expandedIcon--reversed': isSelectedAndExpanded
		});

		return (
			<Icon
				className={cn}
				name="chevron-bottom"/>
		);
	}
});
