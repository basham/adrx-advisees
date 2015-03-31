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
  return parseFloat(value).toFixed(exp);
}

function sortBy(property) {
  return function(a, b) {
    return sort(a[property], b[property]);
  }
}

function sort(a, b) {
  a = isString(a) ? a.toLowerCase() : a;
  b = isString(b) ? b.toLowerCase() : b;
  return a < b ? -1 : (a > b ? 1 : 0);
}

module.exports = {
  api: api,
  getQueryParams: getQueryParams,
  getFocusableElements: getFocusableElements,
  isString: isString,
  pluralize: pluralize,
  requestCallback: requestCallback,
  round: round,
  sortBy: sortBy,
  sort: sort
};
