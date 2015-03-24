'use strict';

var React = require('react');

var Icon = React.createClass({
  render: function() {
    var classNames = [
      'adv-Icon',
      'adv-Icon--' + this.props.name
    ].join(' ');

    return this.transferPropsTo(
      <svg
        className={classNames}
        dangerouslySetInnerHTML={{__html:
          "<use xlink:href=\"#adv-Icon--" + this.props.name + "\"></use>"
        }}>
      </svg>
    );
  }
});

module.exports = Icon;
