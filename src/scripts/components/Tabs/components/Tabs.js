var React = require('react');

var uuid = require('../helpers/uuid');

module.exports = React.createClass({
  displayName: 'Tabs',
  propTypes: {
    className: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    selectedIndex: React.PropTypes.number
  },
  //
  // Lifecycle methods
  //
  getDefaultProps: function() {
    return {
      selectedIndex: 0
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
      this.getTabs(),
      function(tab, index) {
        return React.cloneElement(tab, {
          expanded: this.state.showPanel,
          id: this.state.tabIds[index],
          onClick: this.handleClick(index, tab.props.disabled),
          onKeyDown: this.handleKeyDown,
          panelId: this.state.panelIds[index],
          ref: 'tabs-' + index,
          selected: this.state.selectedIndex === index
        });
      }.bind(this)
    );

    var tabList = React.cloneElement(this.getTabList(), {}, tabs);

    var tabPanels = React.Children.map(
      this.getPanels(),
      function(panel, index) {
        return React.cloneElement(panel, {
          id: this.state.panelIds[index],
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
        event.preventDefault();
        this.selectNext();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
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
      return el;
    }

    return getDescendants(this);
  },
  getDescendantsByType: function(type) {
    return this.getDescendants().filter(function(component) {
      return (!!component && !!component.type) ? component.type.displayName === type : false;
    });
  },
  getTabList: function() {
    return this.getDescendantsByType('TabList')[0];
  },
  getTabs: function() {
    return this.getDescendantsByType('Tab');
  },
  getPanels: function() {
    return this.getDescendantsByType('TabPanel');
  },
  modifyAndSelectIndex: function(modifier) {
    var index = this.state.selectedIndex;
    var count = this.getTabs().length;
    // Loop through each tab.
    for(var i = 0; i < count; i++) {
      // Modify current index value.
      // Used to abstract the next/previous algorithm.
      index = modifier(index, count);
      // Skip disabled tabs.
      if(this.refs['tabs-' + index].props.disabled) {
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
        showPanel: showPanel
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
