var React = require('react');

var uuid = require('../helpers/uuid');

// Determine if a node from event.target is a Tab element
function isTabNode(node) {
  return node.nodeName === 'LI' && node.getAttribute('role') === 'tab';
}

module.exports = React.createClass({
  displayName: 'Tabs',
  propTypes: {
    selectedIndex: React.PropTypes.number,
    onSelect: React.PropTypes.func,
    focus: React.PropTypes.bool
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
      selectedIndex: 0,
      showPanel: false,
      focus: false
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
      selectedIndex: this.props.selectedIndex,
      focus: this.props.focus,
      tabIds: tabIds,
      panelIds: panelIds
    };
  },
  //
  // Render methods
  //
  render: function() {
    var index = 0;
    var count = 0;
    var children;
    var state = this.state;

    var tabListEl = this.getTabListChild();
    var tabList = React.addons.cloneWithProps(tabListEl, {
      ref: 'tablist',
      //KDM #39 20150403 Passing showPanel to TabPanel child component
      showPanel: this.state.showPanel,
      onTogglePanel: function() {
        //KDM #28 20150403 updating showPanel when toggle icon is clicked
        this.setState({showPanel: !this.state.showPanel});
      }.bind(this),
      children: React.Children.map(this.getTabChildren(), function(tab) {
        var ref = 'tabs-' + index;
        var id = state.tabIds[index];
        var panelId = state.panelIds[index];
        var selected = state.selectedIndex === index;
        var focus = selected && state.focus;

        index++;

        return React.addons.cloneWithProps(tab, {
          ref: ref,
          id: id,
          panelId: panelId,
          selected: selected,
          focus: focus
        });
      })
    });

    index = 0;

    var tabPanels = React.Children.map(this.getPanelChildren(), function(panel) {
      var ref = 'panels-' + index;
      var id = state.panelIds[index];
      var tabId = state.tabIds[index];
      var selected = state.selectedIndex === index;

      index ++;

      return React.addons.cloneWithProps(panel, {
        ref: ref,
        id: id,
        tabId: tabId,
        selected: selected,
        show: state.showPanel
      });
    });

    return (
      <div
        {...this.props}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}>
        {tabList}
        {tabPanels}
      </div>
    );
  },
  //
  // Handler methods
  //
  handleClick: function(event) {
    var node = event.target;
    do {
      if(isTabNode(node)) {
        var index = [].slice.call(node.parentNode.children).indexOf(node);
        var show = index === this.state.selectedIndex ? !this.state.showPanel : true;
        this.setSelected(index, true, show);
        return;
      }
    } while(node = node.parentNode);
  },
  handleKeyDown: function(event) {
    if(isTabNode(event.target)) {
      var index = this.state.selectedIndex,
        showPanel = this.state.showPanel,
        max = this.getTabsCount() - 1,
        preventDefault = false;

      // Select next tab to the left
      if(event.keyCode === 37 || event.keyCode === 38) {
        index -= 1;
        preventDefault = true;

        // Wrap back to last tab if index is negative
        if(index < 0) {
          index = max;
        }
      }
      // Select next tab to the right
      else if(event.keyCode === 39 || event.keyCode === 40) {
        index += 1;
        preventDefault = true;

        // Wrap back to first tab if index exceeds max
        if(index > max) {
          index = 0;
        }
      }
      // Keyed Enter or Space.
      else if(event.keyCode === 13 || event.keyCode === 32) {
        //console.log('---', event.key, event.keyCode, event);
        showPanel = !showPanel;
        preventDefault = true;
      }

      // This prevents scrollbars from moving around
      if(preventDefault) {
        event.preventDefault();
      }

      this.setSelected(index, true, showPanel);
    }
  },
  //
  // Helper methods
  //
  setSelected: function(index, focus, showPanel) {
    // Don't do anything if nothing has changed
    //if(index === this.state.selectedIndex) return;
    // Check index boundary
    //if(index < 0 || index >= this.getTabsCount()) return;

    // Keep reference to last index for event handler
    var last = this.state.selectedIndex;
    showPanel = showPanel === undefined ? true : showPanel;

    // Update selected index
    this.setState({
      selectedIndex: index,
      showPanel: showPanel,
      focus: focus === true
    });

    // Call change event handler
    if(typeof this.props.onSelect2 === 'function') {
      this.props.onSelect2(index, last);
    }
  },
  getDescendants: function() {

    function getDescendants(component) {
      var el = [];
      // Updated by Eunmee Yi on 2015/04/09
      //var children = component.props.children;
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
      //return component.type.displayName === type;
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
    //return React.Children.count(this.props.children[0].props.children);
  },
  getPanelsCount: function() {
    return this.getPanelChildren().length;
    //return React.Children.count(this.props.children.slice(1));
  },
  getTabList: function() {
    return this.refs.tablist;
  },
  getTab: function(index) {
    return this.refs['tabs-' + index];
  },
  getPanel: function(index) {
    return this.refs['panels-' + index];
  }
});
