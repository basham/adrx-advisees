'use strict';

var React = require('react');

var Overlay = React.createClass({
  //
  // Lifecycle methods
  //
  componentDidUpdate: function() {
    // Prevents main document from scrolling.
    this.preventBodyScrolling(this.props.show);
    // Focus on first focusable element when overlay opens.
    if(this.props.show) {
      var focusableEl = this.getFocusableElements();
      if(!!focusableEl.length) {
        focusableEl[0].focus();
      }
    }
  },
  componentWillUnmount: function() {
    this.preventBodyScrolling(false);
  },
  //
  // Render methods
  //
  render: function() {
    // Render nothing if hidden.
    if(!this.props.show) {
      return null;
    }

    return (
      <div
        className="adv-Overlay"
        onKeyDown={this.handleKeyDown}
        tabIndex="0">
        <div
          className="adv-Overlay-backdrop"
          onClick={this.handleBackdropClick}></div>
        <div
          className="adv-Overlay-content"
          ref="content">
          {this.props.children}
        </div>
      </div>
    );
  },
  //
  // Handler methods
  //
  handleBackdropClick: function(e) {
    this.handleCancel(e);
  },
  handleKeyDown: function(e) {
    switch(e.key) {
      case 'Escape':
        this.handleCancel(e);
        break;
      case 'Tab':
        this.handleTab(e);
        break;
    }
  },
  handleCancel: function(e) {
    // Cancel any changes and close.
    e.preventDefault();
    // Trigger onClose callback, assuming it is a function.
    if(!!this.props.onClose && typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  },
  handleTab: function(e) {
    // Discover if the event target is the first or last focusable element
    // within this component.
    var focusableEl = this.getFocusableElements();
    var firstFocusableEl = focusableEl[0];
    var lastFocusableEl = focusableEl[focusableEl.length-1];
    var isTargetFirst = e.target === firstFocusableEl;
    var isTargetLast = e.target === lastFocusableEl;
    // Loop to the last element if shift-tabbing from the first element.
    if(isTargetFirst && e.shiftKey) {
      e.preventDefault();
      lastFocusableEl.focus();
    }
    // Loop to the first element if tabbing from the last element.
    else if(isTargetLast && !e.shiftKey) {
      e.preventDefault();
      firstFocusableEl.focus();
    }
  },
  //
  // Helper methods
  //
  getFocusableElements: function() {
    var content = this.refs.content.getDOMNode();
    var childElementsNodeList = content.querySelectorAll('*');
    var childElementsArray = Array.prototype.slice.call(childElementsNodeList);
    return childElementsArray.filter(function(el) {
      var index = null;
      // Rely on the tabIndex value if one is explicitly set.
      if(el.hasAttribute('tabindex')) {
        index = el.tabIndex;
      }
      // Because IE doesn't return proper tabIndex values, we have to be explicit.
      // http://nemisj.com/focusable/
      else {
        var focusable = 'a body button frame iframe img input object select textarea'.split(' ');
        var nodeName = el.nodeName.toLowerCase();
        var isFocusable = focusable.indexOf(nodeName) !== -1;
        index = isFocusable ? 0 : -1;
      }
      return index === 0;
    });
  },
  preventBodyScrolling: function(preventScroll) {
    document.body.style.overflow = preventScroll ? 'hidden' : '';
  }
});

module.exports = Overlay;
