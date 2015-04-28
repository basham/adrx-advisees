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
          optionName="group"
          options={this.state.options}
          selectedIndex={this.state.selectedIndex}/>
      </div>
    );
  },
  //
  // Handler methods
  //
  handleChange: function(option) {
    var options = this.state.options;
    if (option.isNewOption) {
      option.isNewOption = false;
      option.label = option.value;
      options.push(option);

    }
    var index = this.state.options.indexOf(option);
    this.setState({
      options: options,
      selectedIndex: index
    });
  }
});

module.exports = GroupSelector;
