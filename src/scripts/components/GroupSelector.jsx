'use strict';

var React = require('react');
var Reflux = require('reflux');

var Selector = require('./Selector');
var groupListStore = require('../stores/groups');

var GroupSelector = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [
    Reflux.connect(groupListStore, 'groupList')
  ],
  //
  // Lifecycle methods
  //
  getInitialState: function() {
    return {
      selectedIndex: 0,
      options: [
        {
          label: 'One'
        },
        {
          label: 'Advisee',
          classNames: 'adv-Selector-systemOption'
        },
        {
          label: 'Probation'
        },
        {
          label: 'Admits'
        }
      ]
    };
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <div>
        <Selector
          maxLength={20}
          onChange={this.handleChange}
          onCreate={this.handleCreate}
          optionName="group"
          options={this.state.options}
          selectedIndex={this.state.selectedIndex}/>
      </div>
    );
  },
  //
  // Handler methods
  //
  handleChange: function(index) {
    this.setState({
      selectedIndex: index
    });
    this.context.router.transitionTo('group.view', {}, { id: index });
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
  }
});

module.exports = GroupSelector;
