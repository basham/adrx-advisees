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
      emplids: '',
      ccList: '',
      bccList: '',
      subject: '',
      message: '',
      // Variable to handle the button
      isSendButtonDisabled: true,
      // Variables to handle the error
      errorMessage: null,
      requesting: false
    }
  },
  //
  // Render methods
  //
  render: function() {
    var params = {
      id: this.props.params.id
    };

    //console.log('++ from Group.notify.jsx ++ notifyStore.selectedIds: ', notifyStore.selectedIds);
    //console.log('++ from Group.notify.jsx ++ this.props.notifyData: ', this.props.notifyData);
    var ids = this.props.notifyData || [];
    var count = ids.length;
    var headingLabel = this.props.query.type == 'all' ? 'Notify all students' : ( 'Notify ' + count + helpers.pluralize(count, ' selected student') );
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
          label={headingLabel} />
        {this.renderError()}
        <form
          className="adv-AddMemberForm adv-AddMemberForm--small"
          onSubmit={this.handleSubmit}
        >
          <label
            className="adv-Label"
            htmlFor="toList"
          >
            To
          </label>

          {count} {helpers.pluralize(count, ' student')}
          <hr />
          {names.map(this.renderName)}
          <hr />

          <label
            className="adv-Label"
            htmlFor="ccList"
          >
            Cc
          </label>
          <div className="adv-AddMemberForm-field">
            <input
              className="adv-AddMemberForm-input adv-Input"
              id="ccList"
              maxLength="1000"
              onChange={this.handleInputChange}
              placeholder="Email ids with comma separator"
              type="text"
            />
          </div>
          <label
            className="adv-Label"
            htmlFor="bccList"
          >
            Bcc
          </label>
          <div className="adv-AddMemberForm-field">
            <input
              className="adv-AddMemberForm-input adv-Input"
              id="bccList"
              maxLength="1000"
              onChange={this.handleInputChange}
              placeholder="Email ids with comma separator"
              type="text"
            />
          </div>
          <label
            className="adv-Label"
            htmlFor="subject"
          >
            Subject *
          </label>
          <div className="adv-AddMemberForm-field">
            <input
              className="adv-AddMemberForm-input adv-Input"
              id="subject"
              maxLength="100"
              onChange={this.handleInputChange}
              placeholder="Subject with max length 100"
              type="text"
            />
          </div>
          <label
            className="adv-Label"
            htmlFor="message"
          >
            Body *
          </label>
          <textarea
            className="adv-AddMemberForm-textarea adv-Input"
            id="message"
          />
          <button
            className="adv-AddMemberForm-button adv-Button"
            disabled={this.state.isSendButtonDisabled || this.state.requesting}
            ref="submitButton"
            type="submit"
          >
            {this.renderButtonLabel()}
          </button>
          <button
            className="adv-AddMemberForm-button adv-Button"
            onClick={this.handleCancel}
            ref="cancelButton"
          >
            Cancel
          </button>
        </form>

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
  handleInputChange: function(event) {
    // Set the value to the related state variable
///*
    var stateObject = function() {
      var returnObj = {};
      returnObj[this.target.id] = this.target.value;
         return returnObj;
    }.bind(event)();

    this.setState(stateObject, this.handleSendButtonDisabled);
//*/
/*
    var value = event.target.value;
    this.setState({
      subject: value
    });
*/
    //this.handleSendButtonDisabled();
  },
  handleMessageInputChange: function(event) {
    var value = event.editor.getData();
    this.setState({
      message: value
    }, this.handleSendButtonDisabled);
    console.log( '+++ handleMessageInputChange +++ message = ', this.state.message );
    //this.handleSendButtonDisabled();
  },
  handleCancel: function(event) {
    //event.preventDefault();
    actions.redirect('group', { id: this.props.params.id });
  },
  handleSendButtonDisabled: function() {
    // Debugging area
    console.log( '+++ handleSendButtonDisabled +++ ccList = ', this.state.ccList );
    console.log( '+++ handleSendButtonDisabled +++ bccList = ', this.state.bccList );
    console.log( '+++ handleSendButtonDisabled +++ subject = ', this.state.subject );
    console.log( '+++ handleSendButtonDisabled +++ message = ', this.state.message );

    // Set the attribute "disabled" for the Send button
    var subject = this.state.subject;
    var message = this.state.message;
    var isDisabled = !( !!subject && !!message );

    this.setState({
      isSendButtonDisabled: isDisabled
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.props.params.id;
    var emplids = this.props.notifyData.toString();
    var ccList = this.state.ccList;
    var bccList = this.state.bccList;
    var subject = this.state.subject;
    var message = this.state.message;
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
  focusOnSubmitButton: function() {
    this.refs.submitButton.getDOMNode().focus();
  }
});

module.exports = GroupNotify;
