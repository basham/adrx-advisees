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
    // Attributes
    var style = {display: this.props.selected && this.props.show ? '' : 'none'},
      ariaLabeledBy = this.props.tabId;

    return (
      <div
        {...this.props}
        role="tabpanel"
        id={this.props.id}
        aria-labeledby={ariaLabeledBy}
        style={style}>{this.props.children}</div>
    );
  }
});
