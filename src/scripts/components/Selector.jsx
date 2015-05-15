'use strict';

var React = require('react');
var classNames = require('classnames');

var Icon = require('./icon');

// Store and generate unique ids.
var _uuid = 0;
function uuid() {
  return _uuid++;
}

var Selector = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    maxLength: React.PropTypes.number,
    onChange: React.PropTypes.func,
    onCreate: React.PropTypes.func,
    options: React.PropTypes.array,
    optionName: React.PropTypes.string,
    selectedIndex: React.PropTypes.number
  },
  //
  // Lifecycle methods
  //
  componentWillMount: function() {
    document.addEventListener('click', this.handleBodyClick);
    // Set unique ids for ARIA attributes.
    this.setState({
      optionListId: 'selectorOptionListId-' + uuid(),
      selectedOptionId: 'selectorSelectedOptionId-' + uuid()
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      options: nextProps.options,
      selectedIndex: nextProps.selectedIndex
    });
  },
  componentWillUnmount: function() {
    document.removeEventListener('click', this.handleBodyClick);
  },
  getInitialState: function() {
    return {
      isOpen: false,
      inputValue: '',
      options: [],
      optionName: 'option',
      selectedIndex: 0
    };
  },
  //
  // Render methods
  //
  render: function() {
    var selectorClassNames = classNames({
      'adv-Selector': true
    }, this.props.className);
    var buttonClassNames = classNames({
      'adv-Selector-button': true,
      'adv-Selector-button--open': this.state.isOpen
    });
    var buttonLabel = ['Select', this.props.optionName].join(' ');
    var selectedOption = this.props.options[this.props.selectedIndex];
    if(!selectedOption) {
      selectedOption = {
        label: ''
      }
    }
    var selectedOptionClassNames = classNames({
      'adv-Selector-buttonLabel': true
    }, selectedOption.className);

    return (
      <div className={selectorClassNames}>
        <button
          aria-haspopup="true"
          aria-label={buttonLabel}
          className={buttonClassNames}
          disabled={this.props.disabled}
          onClick={this.handleButtonClick}
          ref="button">
          <div className="adv-Selector-buttonContent">
            <span className={selectedOptionClassNames}>
              {selectedOption.label}
            </span>
            <Icon
              className="adv-Selector-icon"
              name="caret-bottom"/>
          </div>
        </button>
        {this.renderForm()}
      </div>
    );
  },
  renderForm: function() {
    if(!this.state.isOpen) {
      return null;
    }

    var placeholder = ['Find or create a', this.props.optionName].join(' ');

    return (
      <form
        className="adv-Selector-form"
        onSubmit={this.handleSubmit}
        ref="overlay"
        tabIndex="0">
        <div className="adv-Selector-inputBox">
          <input
            aria-activedescendant={this.state.selectedOptionId}
            aria-autocomplete="list"
            aria-expanded="true"
            aria-label={placeholder}
            aria-owns={this.state.optionListId}
            className="adv-Input"
            maxLength={this.props.maxLength}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
            placeholder={placeholder}
            ref="input"
            role="combobox"
            type="text"
            value={this.state.inputValue}/>
        </div>
        <ul
          className="adv-Selector-optionList"
          id={this.state.optionListId}
          role="listbox">
          {this.state.options.map(this.renderOption)}
        </ul>
      </form>
    );
  },
  renderOption: function(option, index) {
    var optionIndex = this.props.options.indexOf(option);
    var isPreselected = this.props.selectedIndex === optionIndex;
    var isSelected = this.state.selectedIndex === index;

    var cn = classNames({
      'adv-Selector-option': true,
      'adv-Selector-option--selected': isSelected
    }, option.className);

    return (
      <li
        className={cn}
        id={isSelected ? this.state.selectedOptionId : null}
        data-id={option.id}
        onClick={this.handleSubmit}
        onMouseOver={this.handleOptionMouseOver(index)}
        role="option">
        <span className='adv-Selector-optionLabel'>
          {option.label}
        </span>
        {isPreselected ? <Icon name="check"/> : null}
      </li>
    );
  },
  renderCreateOption: function(value) {
    return (
      <div className="adv-Selector-createOption">
        Create{' '}
        {this.props.optionName}:{' '}
        <samp className="adv-Selector-createOptionValue">
          <kbd className="adv-Selector-createOptionValue">
            {value}
          </kbd>
        </samp>
      </div>
    );
  },
  //
  // Handler methods
  //
  handleBodyClick: function(event) {
    // Ignore if the component is closed.
    if(!this.state.isOpen) {
      return;
    }
    // Ignore if the click occurs within the overlay.
    if(this.refs.overlay.getDOMNode().contains(event.target)) {
      return;
    }
    // Ignore if the click occurs within the button.
    if(this.refs.button.getDOMNode().contains(event.target)) {
      return;
    }
    // Close the component and ignore returning focus to button.
    this.close(true);
  },
  handleButtonClick: function() {
    if(this.state.isOpen) {
      this.close();
    }
    else {
      this.open();
    }
  },
  handleInputChange: function(event) {
    var inputValue = event.target.value;
    var hasInput = !!inputValue.trim().length;
    var hasMatch = false;

    var options = this.props.options.filter(function(option) {
      var a = option.label.toLowerCase().trim();
      var b = inputValue.toLowerCase().trim();
      if(!hasMatch) {
        hasMatch = a === b;
      }
      return a.search(b) === 0;
    }.bind(this));

    if(hasInput && !hasMatch) {
      options.push({
        isNewOption: true,
        label: this.renderCreateOption(inputValue),
        value: inputValue
      });
    }

    var index = 0;
    this.setState({
      inputValue: inputValue,
      options: options,
      selectedIndex: index
    });
  },
  handleInputKeyDown: function(event) {
    switch(event.key) {
      case 'Escape':
        this.close();
        break;
      case 'Tab':
        // Prevent changing focus,
        // since the input field is the only focusable element.
        event.preventDefault();
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        this.selectNext();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        this.selectPrevious();
        break;
    }
  },
  handleOptionMouseOver: function(index) {
    return function() {
      this.selectIndex(index);
    }.bind(this);
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var option = this.state.options[this.state.selectedIndex];
    if(option.isNewOption) {
      if(this.props.onCreate) {
        this.props.onCreate(option.value);
      }
    }
    else {
      if(this.props.onChange) {
        var index = this.props.options.indexOf(option);
        this.props.onChange(index, option.id);
      }
    }
    this.close();
  },
  //
  // Helper methods
  //
  close: function(ignoreFocus) {
    this.setState({
      inputValue: '',
      isOpen: false,
      options: this.props.options
    }, function() {
      if(!ignoreFocus) {
        this.refs.button.getDOMNode().focus();
      }
    });
  },
  open: function() {
    this.setState({
      isOpen: true
    }, function() {
      this.refs.input.getDOMNode().focus();
    });
  },
  selectNext: function() {
    var index = this.state.selectedIndex;
    index = index + 1 >= this.state.options.length ? 0 : index + 1;
    this.selectIndex(index);
  },
  selectPrevious: function() {
    var index = this.state.selectedIndex;
    index = index === 0 ? this.state.options.length - 1 : index - 1;
    this.selectIndex(index);
  },
  selectIndex: function(index) {
    this.setState({
      selectedIndex: index
    });
  }
});

module.exports = Selector;
