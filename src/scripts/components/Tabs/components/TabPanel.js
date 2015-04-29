var React = require('react');

module.exports = React.createClass({
  displayName: 'TabPanel',
  //
  // Lifecycle methods
  //
  getDefaultProps: function() {
    return {
      selected: false,
      id: null,
      tabId: null
    };
  },
  //
  // Render methods
  //
  render: function() {
    var style = {
      display: this.props.selected && this.props.show ? '' : 'none'
    };
    return (
      <div
        className={this.props.className}
        role="tabpanel"
        id={this.props.id}
        aria-labeledby={this.props.tabId}
        style={style}>{this.props.children}</div>
    );
  }
});
