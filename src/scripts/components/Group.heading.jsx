'use strict';

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Icon = require('./Icon');

module.exports = React.createClass({
  propTypes: {
    groupId: React.PropTypes.string,
    groupName: React.PropTypes.string,
    label: React.PropTypes.string
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <h1 className="adv-App-heading">
        <Link
          className="adv-Link"
          params={{ id: this.props.groupId }}
          to="group">
          {this.props.groupName}
        </Link>
        <Icon
          className="adv-App-breadcrumbsIcon"
          name="chevron-right"/>
        {this.props.label}
      </h1>
    );
  }
});
