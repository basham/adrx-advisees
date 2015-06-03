'use strict';

var config = {
  // Constants
  API_URL: '',
  // Vendor
  CKEDITOR: {
    //contentsCss: styleSheetPath,
    //bodyClass: 'qn-Editor-content',
    //height: '26em',
    uiColor: '#E1D8B7'
  }
};

// Override local config with global config.
var globalConfig = window.config;
if(!!globalConfig) {
  for(var key in globalConfig) {
    config[key] = globalConfig[key];
  }
}

module.exports = config;
