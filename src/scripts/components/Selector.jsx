'use strict';

var React = require('react');
var classNames = require('classnames');

var Icon = require('./icon');

var Selector = React.createClass({
  propTypes: {
    disabled: React.PropTypes.bool,
    items: React.PropTypes.array,
    //inputValue: React.PropTypes.string,
    selectedIndex: React.PropTypes.number,
    labelMaxLength: React.PropTypes.number
  },
  //
  // Lifecycle methods
  //
  componentWillMount: function() {
    document.addEventListener('click', this.handleBodyClick);
  },
  componentWillReceiveProps: function(nextProps) {
    var isNewSelectedIndex = nextProps.selectedIndex !== this.props.selectedIndex;
    if(isNewSelectedIndex) {
      this.setState({
        selectedIndex: nextProps.selectedIndex
      });
    }
    this.setState({
      options: nextProps.items
    });
  },
  componentWillUnmount: function() {
    document.removeEventListener('click', this.handleBodyClick);
  },
  getInitialState: function() {
    return {
      isOpen: true,
      inputValue: '',
      options: [],
      selectedIndex: 0
    };
  },
  //
  // Render methods
  //
  render: function() {
    //var isNewCategorySelected = !!this.props.newItem;
    //var isUncategoriedSelected = !isNewCategorySelected && !this.props.selectedId;

    var selectionClasses = classNames({
      'adv-Selector-selection': true,
      'adv-Selector-selection--open': this.state.isOpen//,
      //'adv-Selector-selection--unspecified': isUncategoriedSelected
    });

    /*
    // Determine category name.
    var selectedName = null;
    if(isNewCategorySelected) {
      selectedName = this.props.newItem;
    }
    else if(isUncategoriedSelected) {
      var unspecifiedCategory = this.state.categorizedNotes.uncategorized;
      selectedName = unspecifiedCategory.name;
    }
    else {
      var categoryList = this.state.categorizedNotes.categorized;
      var selectedCategory = categoryList.filter(function(category) {
        return category.categoryId == this.props.selectedId;
      }.bind(this))[0];
      selectedName = selectedCategory.name;
    }
    */

    //var selectedItem = this.props.items.filter(function(item) {
    //  return item.id === this.props.selectedId;
    //}.bind(this))[0];
    var selectedName = this.props.items[this.props.selectedIndex].label;

    return (
      <div className="adv-Selector">
        <button
          aria-haspopup="true"
          className={selectionClasses}
          disabled={this.props.disabled}
          id="toggleButton"
          onClick={this.handleToggleOptions}
          ref="toggleButton">
          <div className="adv-Selector-selectionContent">
            <span className="adv-Selector-selectionText">
              {selectedName}
            </span>
            <Icon
              className="adv-Selector-icon"
              name="caret-bottom"/>
          </div>
        </button>
        {this.renderCombobox()}
      </div>
    );
  },
  renderCombobox: function() {
    if(!this.state.isOpen) {
      return null;
    }

    var placeholder = ['Find or create a', this.props.itemName].join(' ');

    return (
      <form
        className="adv-Selector-combobox"
        onSubmit={this.handleSubmit}
        ref="overlay"
        tabIndex="0">
        <input
          aria-activedescendant="selectedItem"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-label={placeholder}
          aria-owns="optionList"
          className="adv-Selector-input adv-Input"
          maxLength={this.props.labelMaxLength}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          placeholder={placeholder}
          ref="input"
          role="combobox"
          type="text"
          value={this.state.inputValue}/>
        <ul
          className="adv-Selector-options"
          id="optionList"
          role="listbox">
          {this.state.options.map(this.renderItem)}
        </ul>
      </form>
    );
  },
  renderItem: function(item, index) {
    var itemIndex = this.props.items.indexOf(item);
    var isPreselected = this.props.selectedIndex === itemIndex;
    var isSelected = this.state.selectedIndex === index;

    var optionLabelClasses = classNames({
      'adv-Selector-option': true,
      'adv-Selector-option--selected': isSelected
    }, item.classNames);

    return (
      <li
        className={optionLabelClasses}
        id={isSelected ? 'selectedItem' : null}
        onClick={this.handleSubmit}
        onMouseOver={this.handleMouseOver(index)}
        role="option">
        <span className='adv-Selector-optionLabel'>
          {item.label}
        </span>
        {isPreselected ? <Icon name="check"/> : null}
      </li>
    );
  },
  renderCreateOption: function(value) {
    return (
      <div className="adv-Selector-createOption">
        Create{' '}
        {this.props.itemName}:{' '}
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
  handleBodyClick: function(e) {
    // Ignore if the component is closed.
    if(!this.state.isOpen) {
      return;
    }
    // Ignore if the click occurs within the overlay.
    if(this.refs.overlay.getDOMNode().contains(e.target)) {
      return;
    }
    // Ignore if the click occurs within the button.
    if(this.refs.toggleButton.getDOMNode().contains(e.target)) {
      return;
    }
    // Cancel the open component.
    this.handleCancel();
  },
  handleToggleOptions: function(e) {
    if(!!e && e.preventDefault) {
      e.preventDefault();
    }
    this.setState({
      isOpen: !this.state.isOpen
    }, function() {
      if(this.state.isOpen) {
        // Put focus on the appropriate input.
        //var newCategoryRefId = 'input';
        //var categoryRefId = 'category' + this.props.selectedId;
        //var refId = !!this.props.newItem ? newCategoryRefId : categoryRefId;
        //this.refs[refId].getDOMNode().focus();
        this.refs.input.getDOMNode().focus();
      }
      //else if(!!e) {
      else {
        // Put focus back on the button.
        // But ignore if user clicked away to close.
        this.refs.toggleButton.getDOMNode().focus();
      }
    });
  },
  handleMouseOver: function(index) {
    return function(e) {
      e.preventDefault();
      this.selectIndex(index);
    }.bind(this);
  },
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
      case 'ArrowDown':
      case 'ArrowRight':
        this.handleSelectNext();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        this.handleSelectPrevious();
        break;
    }
  },
  handleCancel: function(e) {
    // Cancel any changes and close.
    this.handleToggleOptions(e);
    // Reset component.
    this.setState({
      inputValue: '',
      options: this.props.items
    });
  },
  handleTab: function(e) {
    // Discover if the event target is the first or last focusable element
    // within this component.
    var overlay = this.refs.overlay.getDOMNode();
    var childElementsNodeList = overlay.querySelectorAll('*');
    var childElementsArray = Array.prototype.slice.call(childElementsNodeList);
    var focusableEl = childElementsArray.filter(function(el) {
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
  handleSelectNext: function() {
    var index = this.state.selectedIndex;
    index = index + 1 >= this.state.options.length ? 0 : index + 1;
    this.selectIndex(index);
  },
  handleSelectPrevious: function() {
    var index = this.state.selectedIndex;
    index = index === 0 ? this.state.options.length - 1 : index - 1;
    this.selectIndex(index);
  },
  selectIndex: function(index) {
    this.setState({
      selectedIndex: index
    });
  },
  handleSubmit: function(e) {
    var item = this.state.options[this.state.selectedIndex];
    var index = this.props.items.indexOf(item);
    this.props.onChange(index);
    this.handleToggleOptions(e);
    this.setState({
      inputValue: ''
    });
  },
  handleOptionInputChange: function(e) {
    // Close the options.
    this.handleToggleOptions(e);
    // Select based on id.
    this.selectCategoryId(e.target.value);
  },
  handleOptionInputKeyDown: function(e) {
    // Enter key works just like space bar or clicking.
    if(e.key == 'Enter') {
      e.preventDefault();
      this.handleOptionInputChange(e);
    }
  },
  handleChange: function(e) {
    var inputValue = e.target.value;
    var hasInput = !!inputValue.trim().length;

    var options = this.props.items.filter(function(item) {
      var a = item.label.toLowerCase().trim();
      var b = inputValue.toLowerCase().trim();
      return a.search(b) === 0;
    }.bind(this));

    if(hasInput) {
      options.push({
        isNewItem: true,
        label: this.renderCreateOption(inputValue)
      });
    }

    this.setState({
      inputValue: inputValue,
      options: options,
      selectedIndex: 0
    });
  },
  handleNewCategoryInputKeyDown: function(e) {
    // Enter key works just like space bar or clicking.
    if(e.key != 'Enter') {
      return;
    }
    // Close the options.
    this.handleToggleOptions(e);
    // Clean the input.
    var newItem = e.target.value.trim();
    // Check for content.
    if(!newItem.length) {
      this.selectCategoryId(0);
      return;
    }
    // Check if the content matches the unspecified name.
    var isUnspecified = newItem.toLowerCase() == 'Unspecified'.toLowerCase();
    if(isUnspecified) {
      this.selectCategoryId(0);
      return;
    }
    // Check if the input matches any existing categories.
    var categoryList = this.state.categorizedNotes.categorized;
    var duplicateCategories = categoryList.filter(function(category) {
      return category.name.toLowerCase() == newItem.toLowerCase();
    }.bind(this));
    // Input matches existing category.
    if(!!duplicateCategories.length) {
      var id = duplicateCategories[0].categoryId;
      this.selectCategoryId(id);
      return;
    }
    // Create a new category.
    this.selectCategoryName(newItem);
  },
  //
  // Helper methods
  //
  selectCategoryId: function(id) {
    id = id == '0' ? 0 : id;
    // Inform the parent component about the change.
    this.props.onChange({
      categoryId: id
    });
    // Clear new category name input value.
    this.setState({
      newItem: null
    });
  },
  selectCategoryName: function(name) {
    // Inform the parent component about the change.
    this.props.onChange({
      newItem: name
    });
    // Match internal state to outer state.
    this.setState({
      newItem: name
    });
  }
});

module.exports = Selector;
