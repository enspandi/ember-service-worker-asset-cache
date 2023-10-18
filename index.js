/* jshint node: true */
'use strict';

var AssetMap = require('./lib/asset-map');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-service-worker-asset-cache',

  included: function(app) {
    this._super.included && this._super.included.apply(this, arguments);
    this.app = app;
    this.app.options = this.app.options || {};
    this.app.options['asset-cache'] = this.app.options['asset-cache'] || {};

    this.app.options['asset-cache'].appName =
        this.app.name || this.app.options['asset-cache'].appName;

    if (this.app.options.fingerprint && this.app.options.fingerprint.enabled) {
      this.app.options['asset-cache'].prepend = this.app.options.fingerprint.prepend;
    }
  },

  treeForServiceWorker(swTree, appTree) {
    var options = this.app.options['asset-cache'];
    
    this._appendRootURLIfMissing(options);
    var assetMapFile = new AssetMap([appTree], options);
    
    return mergeTrees([swTree, assetMapFile]);
  },

  _appendRootURLIfMissing(options) {
    var rootURL = this.app.options.rootURL || '';

    if (!rootURL) {
      return;
    }

    if (!options.prepend || options.prepend.endsWith(rootURL)) {
      return;
    }
    
    options.prepend = options.prepend.slice(0, -1) + rootURL;
  }
};
