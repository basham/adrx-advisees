'use strict';

var React = require('react');

var Icon = require('./Icon');

var Alert = React.createClass({
  render: function() {
    var type = this.props.type || 'error';
    var classNames = [
      'adv-Alert',
      'adv-Alert--' + type
    ].join(' ');

    return this.transferPropsTo(
      <p
        className={classNames}
        ref="alert"
        tabIndex="0">
        <Icon
          className="adv-Alert-icon"
          name={type}/>
        {this.props.message}
      </p>
    );
  }
});

module.exports = Alert;
