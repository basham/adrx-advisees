'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var classNames = require('classnames');
var Heading = require('./Group.heading');

var actions = require('../actions');
var helpers = require('../helpers');

var dataStore = require('../stores/data');
var notifyStore = require('../stores/notify');

var Alert = require('./Alert');
var Dialog = require('./Dialog');
var Icon = require('./Icon');
var config = require('../config');

var GroupNotify = React.createClass({
  mixins: [
    Reflux.listenToMany(actions)
  ],
  propTypes: {
    data: React.PropTypes.object
  },
  statics: {
    // Trigger selected/all ids for output.
    willTransitionTo: function(transition, params, query) {

      //console.log(query);
      if(query.type === 'selected') {
        actions.setNotifyStoreWithSelectedIds();
      } else {
        actions.setNotifyStoreWithAllIds(params.id);
      }
    },
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
    this.editor = window.CKEDITOR.replace('message', config.CKEDITOR);
    this.editor.on('change', this.handleMessageInputChange);
  },
  componentWillUnmount: function() {
    // Destroy the CKEditor instance.
    // Destroying will also remove any event listeners.
    this.editor.destroy();
  },
  getInitialState: function() {
    return {
      // Parameters to be passed
      ccList: '',
      bccList: '',
      subject: '',
      message: '',
      // Variables to control the form
      isSendButtonDisabled: true,
      showDialog: false,
      // Variables to handle the error
      errorMessage: null,
      requesting: false
    }
  },
  //
  // Render methods
  //
  render: function() {
    var dialogMessage = 'The form has unsaved information. Are you sure you want to leave this page?';

    //console.log('++ from Group.notify.jsx ++ notifyStore.selectedIds: ', notifyStore.selectedIds);
    //console.log('++ from Group.notify.jsx ++ this.props.notifyData: ', this.props.notifyData);
    var ids = this.props.notifyData || [];
    var count = ids.length;
    var names =
      ids.map(function(id) {
        return dataStore.data.memberMap[id].studentName;
      })
      .sort()
      ;

    return (
      <div>
        <Heading
          groupId={this.props.params.id}
          groupName={this.props.data.groupName}
          label="Notify" />
        {this.renderError()}
        <form
          className="adv-AddMemberForm adv-AddMemberForm--small"
          onSubmit={this.handleSubmit} >
          <label
            className="adv-Label"
            htmlFor="toList" >
            To
          </label>

          {count} {helpers.pluralize(count, ' student')}
          <hr />
          {names.map(this.renderName)}
          <hr />

          <label
            className="adv-Label"
            htmlFor="ccList" >
            Cc
          </label>
          <div className="adv-AddMemberForm-field">
            <input
              className="adv-AddMemberForm-input adv-Input"
              id="ccList"
              maxLength="1000"
              onChange={this.handleInputChange}
              placeholder="Email ids with comma separator"
              type="text" />
          </div>
          <label
            className="adv-Label"
            htmlFor="bccList" >
            Bcc
          </label>
          <div className="adv-AddMemberForm-field">
            <input
              className="adv-AddMemberForm-input adv-Input"
              id="bccList"
              maxLength="1000"
              onChange={this.handleInputChange}
              placeholder="Email ids with comma separator"
              type="text" />
          </div>
          <label
            className="adv-Label"
            htmlFor="subject" >
            Subject *
          </label>
          <div className="adv-AddMemberForm-field">
            <input
              className="adv-AddMemberForm-input adv-Input"
              id="subject"
              maxLength="100"
              onChange={this.handleInputChange}
              placeholder="Subject with max length 100"
              type="text" />
          </div>
          <label
            className="adv-Label"
            htmlFor="message"
          >
            Body *
          </label>
          <textarea
            className="adv-AddMemberForm-textarea adv-Input"
            id="message" />
          <button
            className="adv-AddMemberForm-button adv-Button"
            disabled={this.state.isSendButtonDisabled || this.state.requesting}
            ref="submitButton"
            type="submit" >
            {this.renderButtonLabel()}
          </button>
          <button
            className="adv-AddMemberForm-button adv-Button"
            onClick={this.handleCancel}
            ref="cancelButton" >
            Cancel
          </button>
        </form>
        <Dialog
          cancelButtonLabel="No, stay here"
          confirmationButtonLabel="Yes, cancel"
          message={dialogMessage}
          onCancel={this.handleDialogCancel}
          onConfirm={this.handleDialogConfirm}
          show={this.state.showDialog}
          title="Cancel notification"/>
      </div>
    );
  },
  renderName: function(name) {
    return (
      <div>
        {name}
      </div>
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
  renderEmpty: function() {
    return (
      <p className="adv-App-empty">
        No students in this group.
      </p>
    );
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
  handleInputChange: function(event) {
    // Set the value to the related state variable
    var stateObject = function() {
      var returnObj = {};
      returnObj[this.target.id] = this.target.value;
      return returnObj;
    }.bind(event)();

    this.setState(stateObject, this.handleSendButtonDisabled);
  },
  handleMessageInputChange: function(event) {
    var value = event.editor.getData();
    this.setState({
      message: value
    }, this.handleSendButtonDisabled);
    //console.log( '+++ handleMessageInputChange +++ message = ', this.state.message );
  },
  handleCancel: function(event) {
    event.preventDefault();
    actions.redirect('group', { id: this.props.params.id });
  },
  handleSendButtonDisabled: function() {
    // Debugging area
    //console.log( '+++ handleSendButtonDisabled +++ ccList = ', this.state.ccList );
    //console.log( '+++ handleSendButtonDisabled +++ bccList = ', this.state.bccList );
    //console.log( '+++ handleSendButtonDisabled +++ subject = ', this.state.subject );
    //console.log( '+++ handleSendButtonDisabled +++ message = ', this.state.message );

    // Set the attribute "disabled" for the Send button
    var subject = this.state.subject.trim();
    var message = this.state.message.trim();
    var isDisabled = !( !!subject && !!message );

    this.setState({
      isSendButtonDisabled: isDisabled
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.props.params.id;
    var emplids = this.props.notifyData;
    var ccList = this.state.ccList.trim();
    var bccList = this.state.bccList.trim();
    var subject = this.state.subject.trim();
    var message = this.state.message.trim();
    actions.notifyGroup(groupId, emplids, ccList, bccList, subject, message);
    this.setState({
      requesting: true
    });
  },
  //
  // Action methods
  //
  onNotifyGroupFailed: function(message) {
    this.setState({
      errorMessage: message,
      requesting: false
    }, this.focusOnSubmitButton);
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
  }
});

module.exports = GroupNotify;
