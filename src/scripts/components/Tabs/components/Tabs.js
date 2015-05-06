var React = require('react');

var uuid = require('../helpers/uuid');

module.exports = React.createClass({
  displayName: 'Tabs',
  propTypes: {
    className: React.PropTypes.string,
    focus: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    selectedIndex: React.PropTypes.number
  },
  //
  // Lifecycle methods
  //
  componentWillMount: function() {
    var tabsCount = this.getTabsCount();
    var panelsCount = this.getPanelsCount();

/*
    if(tabsCount !== panelsCount) {
      console.log('There should be an equal number of Tabs and TabPanels. Received', tabsCount, 'Tabs and', panelsCount, 'TabPanels.');
    }
*/
  },
  getDefaultProps: function() {
    return {
      focus: false,
      selectedIndex: 0,
      showPanel: false
    };
  },
  getInitialState: function() {
    var tabIds = [];
    var panelIds = [];

    // Setup tab/panel ids
    React.Children.forEach(this.props.children[0].props.children, function() {
      tabIds.push(uuid());
      panelIds.push(uuid());
    });

    return {
      focus: this.props.focus,
      panelIds: panelIds,
      selectedIndex: this.props.selectedIndex,
      tabIds: tabIds
    };
  },
  //
  // Render methods
  //
  render: function() {
    var tabs = React.Children.map(
      this.getTabChildren(),
      function(tab, index) {
        var isSelected = this.state.selectedIndex === index;
        return React.cloneElement(tab, {
          focus: isSelected && this.state.focus,
          id: this.state.tabIds[index],
          onClick: this.handleClick(index, tab.props.disabled),
          onKeyDown: this.handleKeyDown,
          panelId: this.state.panelIds[index],
          ref: 'tabs-' + index,
          selected: isSelected
        });
      }.bind(this)
    );

    var tabList = React.cloneElement(
      this.getTabListChild(),
      {
        ref: 'tablist',
        //KDM #39 20150403 Passing showPanel to TabPanel child component
        showPanel: this.state.showPanel
      },
      tabs
    );

    var tabPanels = React.Children.map(
      this.getPanelChildren(),
      function(panel, index) {
        return React.cloneElement(panel, {
          id: this.state.panelIds[index],
          ref: 'panels-' + index,
          selected: this.state.selectedIndex === index,
          show: this.state.showPanel,
          tabId: this.state.tabIds[index]
        });
      }.bind(this)
    );

    return (
      <div className={this.props.className}>
        {tabList}
        {tabPanels}
      </div>
    );
  },
  //
  // Handler methods
  //
  handleClick: function(index, isDisabled) {
    return function(event) {
      if(isDisabled) {
        return;
      }
      var show = index === this.state.selectedIndex ? !this.state.showPanel : true;
      this.selectIndex(index, show);
    }.bind(this);
  },
  handleKeyDown: function(event) {
    switch(event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        this.selectNext();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        this.selectPrevious();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleOpen();
        break;
    }
  },
  //
  // Helper methods
  //
  getDescendants: function() {

    function getDescendants(component) {
      var el = [];
      // Updated by Eunmee Yi on 2015/04/09
      var children = (!!component && !!component.props) ? component.props.children : [];
      var hasChildren = Array.isArray(children) && children.length;
      if(hasChildren) {
        children.forEach(function(child) {
          // Add child to array.
          el.push(child);
          // Add the child's children to array.
          el = el.concat(getDescendants(child));
        })
      }
      // Added by Eunmee Yi on 2015/04/09
      // For debugging
      //if(!!component && !!component.type) {
      /*
      if(!!component && !!component.type && !!component.type.displayName) {
        console.log('----- in function getDescendants() ', component.type, '---' , component.type.displayName);
      }
      */
      return el;
    }

    return getDescendants(this);
  },
  getDescendantsByType: function(type) {
    return this.getDescendants().filter(function(component) {
      // Updated by Eunmee Yi on 2015/04/09
      return (!!component && !!component.type) ? component.type.displayName === type : false;
    });
  },
  getTabListChild: function() {
    return this.getDescendantsByType('TabList')[0];
  },
  getTabChildren: function() {
    return this.getDescendantsByType('Tab');
  },
  getPanelChildren: function() {
    return this.getDescendantsByType('TabPanel');
  },
  getTabsCount: function() {
    return this.getTabChildren().length;
  },
  getPanelsCount: function() {
    return this.getPanelChildren().length;
  },
  getTabList: function() {
    return this.refs.tablist;
  },
  getTab: function(index) {
    return this.refs['tabs-' + index];
  },
  getPanel: function(index) {
    return this.refs['panels-' + index];
  },
  modifyAndSelectIndex: function(modifier) {
    var index = this.state.selectedIndex;
    var count = this.getTabsCount();
    // Loop through each tab.
    for(var i = 0; i < count; i++) {
      // Modify current index value.
      // Used to abstract the next/previous algorithm.
      index = modifier(index, count);
      // Skip disabled tabs.
      if(this.getTab(index).props.disabled) {
        continue;
      }
      // Select index.
      else {
        this.selectIndex(index);
        break;
      }
    }
  },
  selectIndex: function(index, showPanel) {
    // Open the panel unless explicitly set.
    showPanel = showPanel === undefined ? this.state.showPanel : showPanel;
    var lastSelectedIndex = this.state.selectedIndex;

    this.setState(
      {
        selectedIndex: index,
        showPanel: showPanel,
        focus: true
      },
      function() {
        var hasCallback = typeof this.props.onSelect === 'function';
        var isNewIndex = index !== lastSelectedIndex;
        // Callback change event handler.
        if(hasCallback && isNewIndex && showPanel) {
          this.props.onSelect(index, lastSelectedIndex);
        }
      }
    );
  },
  selectNext: function() {
    this.modifyAndSelectIndex(function(index, count) {
      index++;
      if(index >= count) {
        index = 0;
      }
      return index;
    });
  },
  selectPrevious: function() {
    this.modifyAndSelectIndex(function(index, count) {
      index--;
      if(index < 0) {
        index = count - 1;
      }
      return index;
    });
  },
  toggleOpen: function() {
    this.setState({
      showPanel: !this.state.showPanel
    });
  }
});
