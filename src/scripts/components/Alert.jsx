'use strict';

var React = require('react');

var Icon = require('./Icon');
var helpers = require('../helpers');

var Alert = React.createClass({
  //
  // Lifecycle methods
  //
  componentDidMount: function() {
    // Focus on first focusable element.
    var el = this.refs.content.getDOMNode();
    var focusableEl = helpers.getFocusableElements(el);
    if(!!focusableEl.length) {
      focusableEl[0].focus();
    }
  },
  //
  // Render methods
  //
  render: function() {
    var type = this.props.type || 'error';
    var classNames = [
      'adv-Alert',
      'adv-Alert--' + type
    ].join(' ');

    return (
      <p
        className={classNames}
        ref="content"
        role="alert">
        <Icon
          className="adv-Alert-icon"
          name={type}/>
        {this.props.message}
      </p>
    );
  }
});

module.exports = Alert;
