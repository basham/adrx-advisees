'use strict';

var React = require('react');

var Heading = require('./Group.heading');
var RenameGroup = require('./Group.edit.rename');
var RemoveAllMembers = require('./Group.edit.removeMembers');
var DeleteGroup = require('./Group.edit.delete');

var GroupEdit = React.createClass({
  propTypes: {
    data: React.PropTypes.object
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <div className="adv-App-editView">
        <Heading
          groupId={this.props.params.id}
          groupName={this.props.data.groupName}
          label="Edit Group" />
        <RenameGroup data={this.props.data} />
        <RemoveAllMembers data={this.props.data} />
        <DeleteGroup data={this.props.data} />
      </div>
    );
  }
});

module.exports = GroupEdit;
