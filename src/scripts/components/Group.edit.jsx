'use strict';

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var DeleteGroup = require('./Group.edit.delete');
var RemoveAllMembers = require('./Group.edit.removeMembers');
var RenameGroup = require('./Group.edit.rename');

var GroupEdit = React.createClass({
  propTypes: {
    data: React.PropTypes.object
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <div className="adv-App-editGroup">
        <header className="adv-App-header">
          <h1 className="adv-App-heading">
            Edit <em>{this.props.data.groupName}</em>
          </h1>
          <Link
            className="adv-Button"
            params={{ id: this.props.params.id }}
            to="group.membership">
            Cancel
          </Link>
        </header>
        <RenameGroup data={this.props.data} />
        <RemoveAllMembers data={this.props.data} />
        <DeleteGroup data={this.props.data} />
      </div>
    );
  }
});

module.exports = GroupEdit;
