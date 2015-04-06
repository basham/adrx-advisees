/** @jsx React.DOM */
var React = require('react');
var classNames = require('classnames');
var Icon = require('../../Icon');

module.exports = React.createClass({
	displayName: 'TabList',

	getInitialState: function () {
		return {
			//KDM #28 Receiving showPanel from Tabs parent component
			showPanel: this.props.showPanel,
			kdmArgument: this.props.kdmArgument
		};
	},

	render: function () {
		var state = this.state;
		console.log('TabList.render() kdmArgument: ', this.props.kdmArgument);
		console.log('TabList.render(): showPanel', this.props.showPanel);
		var cn = classNames({
			'adv-Icon': true,
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
					name="caret-bottom" 
					onClick={this.handleClick.bind(this)}/>
			</div>
		);
	},

	handleClick: function (e) {
		e.preventDefault();
		console.log('You clicked arror!');

		// Call change event handler
		if (typeof this.props.onTogglePanel === 'function') {
			this.props.onTogglePanel('KDM');
		}
	}

});
