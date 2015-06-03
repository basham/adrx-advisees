'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var classNames = require('classnames');
var Heading = require('./Group.heading');

var actions = require('../actions');
var helpers = require('../helpers');

var messageStore = require('../stores/message');

var Alert = require('./Alert');
var Dialog = require('./Dialog');
var Icon = require('./Icon');
var config = require('../config');

var GroupMessage = React.createClass({
  mixins: [
    Reflux.listenTo(messageStore, 'onMessageStoreChange'),
    Reflux.listenToMany(actions)
  ],
  propTypes: {
    data: React.PropTypes.object
  },
  statics: {
    willTransitionFrom: function(transition, component, callback) {
      if(component.formHasUnsavedData() && !component.state.requesting) {
        component.handleDialog(
          // Confirm transition.
          function() {
            callback();
          },
          // Abort transition.
          function() {
            transition.abort();
            callback();
          }
        );
      }
      else {
        callback();
      }
    }
  },
  //
  // Lifecycle methods
  //
  componentDidMount: function() {
    // Replace the textarea with a CKEditor instance.
    this.editor = window.CKEDITOR.replace('adv-MessageForm-body', config.CKEDITOR);
    this.editor.on('change', this.handleMessageInputChange);
    // Force message store output.
    messageStore.output();
  },
  componentWillUnmount: function() {
    // Destroy the CKEditor instance.
    // Destroying will also remove any event listeners.
    // `destroy()` may not work during the auto-redirect,
    // which happens when there are no selected members.
    try {
      this.editor.destroy();
    }
    catch(err) {}
  },
  getInitialState: function() {
    return {
      // Parameters to be passed
      ccList: '',
      bccList: '',
      subject: '',
      message: '',
      // Variables to control the form
      isDisabled: true,
      selectedMembers: [],
      showDialog: false,
      showToList: false,
      // Variables to handle the error
      errorMessage: null,
      requesting: false
    }
  },
  //
  // Render methods
  //
  render: function() {
    var dialogMessage = 'The message will be lost. Are you sure you want to cancel?';

    return (
      <div className="adv-App-editView">
        <Heading
          groupId={this.props.params.id}
          groupName={this.props.data.groupName}
          label="New message" />
        {this.renderError()}
        <form
          className="adv-MessageForm"
          onSubmit={this.handleSubmit}>
          <dl className="adv-MessageForm-field">
            <dt className="adv-MessageForm-label">
              To
            </dt>
            <dd className="adv-MessageForm-toListControl">
              {this.renderToListControl()}
            </dd>
          </dl>
          {this.renderToList()}
          <div className="adv-MessageForm-field">
            <label
              className="adv-MessageForm-label"
              htmlFor="adv-MessageForm-cc">
              Cc
            </label>
            <input
              aria-describedby="adv-MessageForm-ccDescription"
              className="adv-MessageForm-input adv-Input"
              id="adv-MessageForm-cc"
              maxLength="1000"
              onChange={this.handleInputChange('ccList')}
              type="text" />
          </div>
          <div className="adv-MessageForm-field">
            <label
              className="adv-MessageForm-label"
              htmlFor="adv-MessageForm-bcc">
              Bcc
            </label>
            <input
              aria-describedby="adv-MessageForm-ccDescription"
              className="adv-MessageForm-input adv-Input"
              id="adv-MessageForm-bcc"
              maxLength="1000"
              onChange={this.handleInputChange('bccList')}
              type="text" />
          </div>
          <p
            className="adv-MessageForm-description"
            id="adv-MessageForm-ccDescription">
            Separate email addresses with a comma.
          </p>
          <label
            className="adv-MessageForm-label adv-Label"
            htmlFor="adv-MessageForm-subject">
            Subject <abbr title="required">*</abbr>
          </label>
          <input
            className="adv-MessageForm-input adv-Input"
            id="adv-MessageForm-subject"
            maxLength="100"
            onChange={this.handleInputChange('subject')}
            required
            type="text" />
          <label
            className="adv-Label"
            htmlFor="adv-MessageForm-body">
            Body <abbr title="required">*</abbr>
          </label>
          <textarea
            className="adv-MessageForm-textarea adv-Input"
            id="adv-MessageForm-body" />
          <div className="adv-MessageForm-controls">
            <button
              className="adv-MessageForm-button adv-Button"
              disabled={this.state.isDisabled || this.state.requesting}
              ref="submitButton"
              type="submit" >
              {this.renderButtonLabel()}
            </button>
            <button
              className="adv-MessageForm-button adv-Button"
              onClick={this.handleCancel}
              ref="cancelButton" >
              Cancel
            </button>
          </div>
        </form>
        <Dialog
          cancelButtonLabel="No, continue writing"
          confirmationButtonLabel="Yes, cancel"
          message={dialogMessage}
          onCancel={this.handleDialogCancel}
          onConfirm={this.handleDialogConfirm}
          show={this.state.showDialog}/>
      </div>
    );
  },
  renderToListControl: function() {
    if(!this.state.selectedMembers) {
      return null;
    }

    var count = this.state.selectedMembers.length;

    if(count === 0) {
      return 'No students';
    }

    if(count === 1) {
      return this.state.selectedMembers[0];
    }

    return (
      <button
        aria-controls="adv-MessageForm-toList"
        aria-expanded={this.state.showToList}
        className="adv-Link"
        onClick={this.handleShowToList}>
        {count} {helpers.pluralize(count, ' student')}
      </button>
    );
  },
  renderToList: function() {
    if(!this.state.selectedMembers || this.state.selectedMembers.length <= 1 || !this.state.showToList) {
      return null;
    }

    return (
      <ul
        className="adv-MessageForm-toList"
        id="adv-MessageForm-toList">
        {this.state.selectedMembers.map(this.renderToListItem)}
      </ul>
    );
  },
  renderToListItem: function(member) {
    return (
      <li className="adv-MessageForm-toListItem">
        {member.name}
      </li>
    );
  },
  renderError: function() {
    if(!this.state.errorMessage) {
      return null;
    }

    return (
      <Alert
        message={this.state.errorMessage}
        ref="error"
        type="error"/>
    );
  },
  renderButtonLabel: function() {
    if(!this.state.requesting) {
      return 'Send';
    }

    return (
      <span>
        Sending
        <span className="adv-ProcessIndicator"/>
      </span>
    )
  },
  //
  // Handler methods
  //
  handleDialog: function(confirmCallback, cancelCallback) {

    this.handleDialogCancel = function() {
      this.setState({
        showDialog: false
      }, this.focusOnCancelButton);
      cancelCallback();
    }.bind(this);

    this.handleDialogConfirm = function() {
      confirmCallback();
    };

    this.setState({
      showDialog: true
    });
  },
  handleInputChange: function(key) {
    // Set the value in state for the given key.
    return function(event) {
      var state = {};
      state[key] = event.target.value;
      this.setState(state, this.validateForm);
    }.bind(this);
  },
  handleMessageInputChange: function(event) {
    var value = event.editor.getData();
    this.setState({
      message: value
    }, this.validateForm);
  },
  handleCancel: function(event) {
    event.preventDefault();
    actions.redirect('group', { id: this.props.params.id });
  },
  handleShowToList: function(event) {
    event.preventDefault();
    this.setState({
      showToList: !this.state.showToList
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.props.params.id;
    var emplids = this.state.selectedMembers.map(function(member) {
      return member.id;
    });
    var ccList = this.state.ccList.trim();
    var bccList = this.state.bccList.trim();
    var subject = this.state.subject.trim();
    var message = this.state.message.trim();
    actions.messageGroup(groupId, emplids, ccList, bccList, subject, message);
    this.setState({
      requesting: true
    });
  },
  //
  // Action methods
  //
  onMessageGroupFailed: function(message) {
    this.setState({
      errorMessage: message,
      requesting: false
    }, this.focusOnSubmitButton);
  },
  onMessageStoreChange: function(selectedMembers) {
    if(selectedMembers.length === 0) {
      actions.redirect('group', { id: this.props.params.id });
      return;
    }

    this.setState({
      selectedMembers: selectedMembers
    });
  },
  //
  // Helper methods
  //
  focusOnCancelButton: function() {
    this.refs.cancelButton.getDOMNode().focus();
  },
  focusOnSubmitButton: function() {
    this.refs.submitButton.getDOMNode().focus();
  },
  formHasUnsavedData: function() {
    var ccList = this.state.ccList.trim();
    var bccList = this.state.bccList.trim();
    var subject = this.state.subject.trim();
    var message = this.state.message.trim();
    return !!ccList || !!bccList || !!subject || !!message;
  },
  validateForm: function() {
    // Set the attribute "disabled" for the Send button
    var subject = this.state.subject.trim();
    var message = this.state.message.trim();
    var isDisabled = !( !!subject && !!message );

    this.setState({
      isDisabled: isDisabled
    });
  }
});

module.exports = GroupMessage;
