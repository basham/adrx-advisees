'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var classNames = require('classnames');

var actions = require('../actions');
var helpers = require('../helpers');
var notifyStore = require('../stores/notify');

var Alert = require('./Alert');
var Icon = require('./Icon');

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
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      message: '',
      isDisabledButtonSend: true
    }
  },
  //
  // Render methods
  //
  render: function() {
    var params = {
      id: this.props.params.id,
      type: this.props.params.type
    };

    console.log('++ from Group.notify.jsx ++ ', this.props.notifyData);

    return (
      <div>
        <h1 className="adv-App-heading">
          Notify for {this.props.data.groupName}
        </h1>
        <Link
          className="adv-Link adv-Link--underlined"
          params={params}
          to="group">
          Return to Group
        </Link>
        {this.renderError()}
        --- {this.selectedIds}
        ----- {this.props.params.type}

        <form
          className="adv-AddMemberForm adv-AddMemberForm--small"
          onSubmit={this.handleSubmit}
        >
          <label
            className="adv-Label"
            htmlFor="adv-AddMemberForm-input">
            To
          </label>
          {notifyStore.selectedIds}
          <label
            className="adv-Label"
            htmlFor="adv-AddMemberForm-input">
            Cc
          </label>
          <div className="adv-AddMemberForm-field">
            <input
              className="adv-AddMemberForm-input adv-Input"
              id="cc"
              maxLength="1000"
              onChange={this.handleInputChange}
              placeholder="Email ids with comma separator"
              type="text"/>
          </div>
          <label
            className="adv-Label"
            htmlFor="adv-AddMemberForm-input">
            Bcc
          </label>
          <div className="adv-AddMemberForm-field">
            <input
              className="adv-AddMemberForm-input adv-Input"
              id="bcc"
              maxLength="1000"
              onChange={this.handleInputChange}
              placeholder="Email ids with comma separator"
              type="text"/>
          </div>
          <label
            className="adv-Label"
            htmlFor="adv-AddMemberForm-input">
            Subject *
          </label>
          <div className="adv-AddMemberForm-field">
            <input
              className="adv-AddMemberForm-input adv-Input"
              id="subject"
              maxLength="100"
              onChange={this.handleInputChange}
              placeholder="Subject"
              required
              type="text"/>
          </div>
          <label
            className="adv-Label"
            htmlFor="adv-AddMemberForm-textarea">
            Body *
          </label>
          <textarea
            className="adv-AddMemberForm-textarea adv-Input"
            id="message"
            onChange={this.handleInputChange}
            placeholder="Mail body"
            required
            rows="5"
            />
          <button
            className="adv-AddMemberForm-button adv-Button"
            disabled={this.state.isDisabledButtonSend}
            type="submit">
            Send
          </button>
          <button
            className="adv-AddMemberForm-button adv-Button"
          >
            Cancel
          </button>
        </form>

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
    this.setState({
      isDisabledButtonSend: !this.state.isDisabledButtonSend ? true : false,
      inputValue: event.target.value
    });
  },
  handleMessageInputChange: function(event) {
    var value = event.editor.getData();
    this.setState({
      message: value
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var groupId = this.props.data.groupId;
    var value = this.state.inputValue;
    actions.notifyGroup(groupId, value);
  },
  //
  // Action methods
  //
  onAddMemberCompleted: function() {
    this.setState({
      inputValue: ''
    });
  }
});

module.exports = GroupNotify;
