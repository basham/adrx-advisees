var React = require('react');
var classNames = require('classnames');

function syncNodeAttributes(node, props) {
  if(props.selected && !props.disabled && props.focus) {
    node.focus();
  }
}

module.exports = React.createClass({
  displayName: 'Tab',
  propTypes: {
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    expanded: React.PropTypes.bool,
    focus: React.PropTypes.bool,
    id: React.PropTypes.string,
    panelId: React.PropTypes.string,
    selected: React.PropTypes.bool
  },
  //
  // Lifecycle methods
  //
  componentDidMount: function() {
    syncNodeAttributes(this.getDOMNode(), this.props);
  },
  componentDidUpdate: function() {
    syncNodeAttributes(this.getDOMNode(), this.props);
  },
  getDefaultProps: function() {
    return {
      focus: false,
      id: null,
      panelId: null,
      selected: false
    };
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
        role="tab"
        tabIndex={this.props.selected && !this.props.disabled ? 0 : null}>
        {this.props.children}
      </li>
    );
  }
});
