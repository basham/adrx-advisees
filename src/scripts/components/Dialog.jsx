'use strict';

var React = require('react');

var Overlay = require('./Overlay');

// Store and generate unique ids.
var _uuid = 0;
function uuid() {
  return _uuid++;
}

var Dialog = React.createClass({
  propTypes: {
    cancelButtonLabel: React.PropTypes.string,
    confirmationButtonLabel: React.PropTypes.string,
    message: React.PropTypes.string,
    onCancel: React.PropTypes.func,
    onConfirm: React.PropTypes.func,
    title: React.PropTypes.string,
    show: React.PropTypes.bool
  },
  //
  // Lifecycle methods
  //
  componentWillMount: function() {
    // Guarantee ids are unique.
    this.setState({
      contentId: !!this.props.message ? uuid() : null,
      titleId: !!this.props.title ? uuid() : null
    });
  },
  //
  // Render methods
  //
  render: function() {
    return (
      <Overlay show={this.props.show}>
        <section
          aria-describedby={this.state.contentId}
          aria-labelledby={this.state.titleId}
          className="adv-Dialog"
          role="alertdialog">
          {this.renderTitle()}
          {this.renderMessage()}
          <div className="adv-Dialog-actions">
            <button
              className="adv-Dialog-action adv-Button"
              onClick={this.handleConfirm}>
              {this.props.confirmationButtonLabel || 'Okay'}
            </button>
            <button
              className="adv-Dialog-action adv-Button"
              onClick={this.handleCancel}>
              {this.props.cancelButtonLabel || 'Cancel'}
            </button>
          </div>
        </section>
      </Overlay>
    );
  },
  renderTitle: function() {
    if(!this.props.title) {
      return null;
    }
    return (
      <h1
        className="adv-Dialog-title"
        id={this.state.titleId}>
        {this.props.title}
      </h1>
    );
  },
  renderMessage: function() {
    if(!this.props.message) {
      return null;
    }
    return (
      <p
        className="adv-Dialog-message"
        id={this.state.contentId}>
        {this.props.message}
      </p>
    );
  },
  //
  // Handler methods
  //
  handleCancel: function(e) {
    // Cancel any changes and close.
    e.preventDefault();
    // Trigger callback, assuming it is a function.
    if(!!this.props.onCancel && typeof this.props.onCancel === 'function') {
      this.props.onCancel();
    }
  },
  handleConfirm: function(e) {
    // Cancel any changes and close.
    e.preventDefault();
    // Trigger callback, assuming it is a function.
    if(!!this.props.onConfirm && typeof this.props.onConfirm === 'function') {
      this.props.onConfirm();
    }
  }
});

module.exports = Dialog;
