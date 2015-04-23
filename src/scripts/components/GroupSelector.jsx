'use strict';

var React = require('react');
var Reflux = require('reflux');

var Selector = require('./Selector');
var groupListStore = require('../stores/groups');

var GroupSelector = React.createClass({
  mixins: [
    Reflux.connect(groupListStore, 'groupList')
  ],
  //
  // Lifecycle methods
  //
  getInitialState: function() {
    return {
      selectedIndex: 0,
      items: [
        {
          label: 'One'
        },
        {
          label: 'Advisee',
          classNames: 'adv-Selector-option--system'
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
        <label
          className="adv-Label"
          htmlFor="toggleButton">
          Groups
        </label>
        <Selector
          items={this.state.items}
          itemName="group"
          labelMaxLength={20}
          onChange={this.handleChange}
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
  }
});

module.exports = GroupSelector;
