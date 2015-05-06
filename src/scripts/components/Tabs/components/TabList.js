var React = require('react');

module.exports = React.createClass({
  displayName: 'TabList',
  propTypes: {
    className: React.PropTypes.string
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <ul
        className={this.props.className}
        role="tablist">
        {this.props.children}
      </ul>
    );
  }
});
