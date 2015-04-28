'use strict';

var React = require('react');
var classNames = require('classnames');

var Icon = React.createClass({
  render: function() {
    var cn = classNames(
      'adv-Icon',
      'adv-Icon--' + this.props.name,
      this.props.className
    );

    return (
      <svg
        className={cn}
        dangerouslySetInnerHTML={{__html:
          "<use xlink:href=\"#adv-Icon--" + this.props.name + "\"></use>"
        }}>
      </svg>
    );
  }
});

module.exports = Icon;
