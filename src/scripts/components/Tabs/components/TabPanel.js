var React = require('react');

module.exports = React.createClass({
  displayName: 'TabPanel',
  propTypes: {
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    selected: React.PropTypes.bool,
    show: React.PropTypes.bool,
    tabId: React.PropTypes.string
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
