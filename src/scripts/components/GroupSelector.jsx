'use strict';

var React = require('react');
var Reflux = require('reflux');

var Selector = require('./Selector');
var groupListStore = require('../stores/groupList');
var actions = require('../actions');

var GroupSelector = React.createClass({
  contextTypes: {
    className: React.PropTypes.string,
    router: React.PropTypes.func
  },
  mixins: [
    Reflux.listenTo(groupListStore, 'onStoreChange'),
    Reflux.listenToMany(actions)
  ],
  propTypes: {
    selectedId: React.PropTypes.string,
  },
  //
  // Lifecycle methods
  //
  componentDidMount: function() {
    if(groupListStore.data) {
      this.onStoreChange(groupListStore.data);
    }
  },
  getInitialState: function() {
    return {
      selectedIndex: 0,
      options: []
    };
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <Selector
        className={this.props.className}
        maxLength={20}
        onChange={this.handleChange}
        onCreate={this.handleCreate}
        optionName="group"
        options={this.state.options}
        selectedIndex={this.state.selectedIndex}/>
    );
  },
  //
  // Handler methods
  //
  handleChange: function(index, id) {
    this.setState({
      selectedIndex: index
    });
    this.context.router.transitionTo('group.view', { id: id });
  },
  handleCreate: function(value) {
    var options = this.state.options;
    // Create new option.
    var newOption = {
      label: value
    };
    // Add the new option to the option list.
    options.push(newOption);
    // Get the index of the new option.
    var index = options.indexOf(newOption);
    // Update state and select the new option.
    this.setState({
      options: options,
      selectedIndex: index
    });

    actions.createGroup(value);
  },
  //
  // Store methods
  //
  onStoreChange: function(data) {
    var selectedId = this.props.selectedId ? this.props.selectedId : data.defaultId;
    var selectedIndex = this.state.selectedIndex;
    // Generate an array of options, appropriate for the Selector component.
    var options = data.items.map(function(group, index) {
      if(selectedId == group.groupId) {
        selectedIndex = index;
      }
      return {
        label: group.groupName,
        id: group.groupId
      };
    });
    // Set state.
    this.setState({
      options: options,
      selectedIndex: selectedIndex
    });
  },
  //
  // Action methods
  //
  onCreateGroupCompleted: function(group) {
    var id = group.groupId;
    var option = this.state.options.filter(function(option) {
      return option.id === id;
    })[0];
    // Get the index of the created option.
    var index = this.state.options.indexOf(option);
    // Change to the created option.
    this.handleChange(index, id);
  }
});

module.exports = GroupSelector;
