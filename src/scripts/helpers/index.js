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

module.exports = {
  api: api,
  getQueryParams: getQueryParams,
  requestCallback: requestCallback,
  round: round
};
