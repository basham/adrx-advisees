var React = require('react');

module.exports = React.createClass({
  displayName: 'Tab',
  propTypes: {
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    expanded: React.PropTypes.bool,
    id: React.PropTypes.string,
    onClick: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    panelId: React.PropTypes.string,
    selected: React.PropTypes.bool
  },
  //
  // Lifecycle methods
  //
  componentDidUpdate: function() {
    this.focus();
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <li
        aria-controls={this.props.panelId}
        aria-disabled={this.props.disabled}
        aria-expanded={!!this.props.expanded && !!this.props.selected}
        aria-selected={!!this.props.selected}
        className={this.props.className}
        id={this.props.id}
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyDown}
        role="tab"
        tabIndex={this.props.selected && !this.props.disabled ? 0 : null}>
        {this.props.children}
      </li>
    );
  },
  //
  // Helper methods
  //
  focus: function() {
    if(this.props.selected && !this.props.disabled) {
      this.getDOMNode().focus();
    }
  }
});
