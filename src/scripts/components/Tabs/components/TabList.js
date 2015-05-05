var React = require('react');

module.exports = React.createClass({
  displayName: 'TabList',
  //
  // Lifecycle methods
  //
  getInitialState: function() {
    return {
      //KDM #28 Receiving showPanel from Tabs parent component
      showPanel: this.props.showPanel
    };
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
    child.props.expandable = true;
    child.props.expanded = this.props.showPanel;
    return child;
  }
});
