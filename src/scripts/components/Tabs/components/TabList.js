var React = require('react');

module.exports = React.createClass({
  displayName: 'TabList',
  propTypes: {
    className: React.PropTypes.string,
    showPanel: React.PropTypes.bool
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <ul
        className={this.props.className}
        role="tablist">
        {React.Children.map(this.props.children, this.renderChild)}
      </ul>
    );
  },
  renderChild: function(child) {
    child.props.expanded = this.props.showPanel;
    return child;
  }
});
