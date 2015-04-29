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
        aria-labeledby={this.props.tabId}
        className={this.props.className}
        id={this.props.id}
        role="tabpanel"
        style={style}>
        {this.props.children}
      </div>
    );
  }
});
