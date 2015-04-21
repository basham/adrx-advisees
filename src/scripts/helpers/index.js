'use strict';

var config = require('../config');

function api(method, query) {
  // Create an object, if not provided.
  query = !!query ? query : {};
  // Append the method, if provided.
  if(!!method) {
    query.methodToCall = method;
  }
  // Build query string based on keys.
  var queryString = Object.keys(query).map(function(key) {
    var value = query[key];
    if(!value) {
      return null;
    }
    return '&' + key + '=' + value;
  }).join('');
  // Append query string to base url.
  return config.API_URL + '?' + queryString;
}

function compare(a, b, isAscending) {
  var inverse = isAscending ? 1 : -1;
  a = isString(a) ? a.toLowerCase().trim() : a;
  b = isString(b) ? b.toLowerCase().trim() : b;

  //--------------------------------------------------//
  // Handle if a or b is undefined
  // Return 0 if a and b are undefined at the same time
  //--------------------------------------------------//
  //-- Updated by Eunmee Yi on 2015/04/02
  //--------------------------------------------------//
  var value = a < b ? -1 : (a > b ? 1 : 0);
  value = (!a && !!b) ? -1 : ((!!a && !b) ? 1 : value);
  value *= inverse;
  return value;
}

//--------------------------------------------------//
// `list' and 'criteria' are required.
// 'list' is an array and 'criteria' is an object.
// Examples for the 'criteria': {impact: "Yes"} or {impact:"No", startTerm: "4118"}
//--------------------------------------------------//
//-- Added by Eunmee Yi on 2015/04/09
//--------------------------------------------------//
function filterBy(list, criteria) {
  return list.filter(function(obj) {
    return Object.keys(criteria).every(function(c) {
      return obj[c] == criteria[c];
    })
  })
}

function getFocusableElements($el) {
  var childElementsNodeList = $el.querySelectorAll('*');
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
}

// http://codereview.stackexchange.com/a/10396
function getQueryParams() {
  var query = (window.location.search || '?').substr(1);
  var map = {};

  query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function(match, key, value) {
    var key = decodeURIComponent(key);
    if(key !== 'sr' || key !== 'backdoorId') {
      //return;
    }
    map[key] = decodeURIComponent(value);
  });

  return map;
}

function isString(object) {
  return typeof object === 'string' || object instanceof String;
}

function pluralize(count, singular, plural) {
  plural = !!plural ? plural : singular + 's';
  return count === 1 ? singular : plural;
}

function requestCallback(succeedCallback, failureCallback) {
  return function(err, res) {
    if(err || !res.ok) {
      if(!!failureCallback) {
        failureCallback(err, res);
      }
      return;
    }
    if(!!succeedCallback) {
      var value = res.text;
      if(res.type == 'application/json') {
        value = JSON.parse(value);
      }
      succeedCallback(value);
    }
  }
}

function round(value, exp) {
  return !!value ? parseFloat(value).toFixed(exp) : null;
}

// `key` is required. Sorts based on the key of two objects.
// `isAscending` is optional. Defaults to true.
// `secondaryKey` is optional. No further sorting if initial values are identical.
function sortBy(key, isAscending, secondaryKey) {
  var isAscending = isAscending !== false;
  // Return the compare function.
  return function(a, b) {
    // Initial comparison.
    var comparison = compare(a[key], b[key], isAscending);
    // Potentially sort by secondary key.
    var hasSecondaryKey = !!secondaryKey;
    var isDifferentKey = secondaryKey !== key;
    var isSameValue = comparison === 0;
    if(hasSecondaryKey && isDifferentKey && isSameValue) {
      comparison = compare(a[secondaryKey], b[secondaryKey], true);
    }
    return comparison;
  }
}

module.exports = {
  api: api,
  compare: compare,
  filterBy: filterBy,
  getFocusableElements: getFocusableElements,
  getQueryParams: getQueryParams,
  isString: isString,
  pluralize: pluralize,
  requestCallback: requestCallback,
  round: round,
  sortBy: sortBy
};
