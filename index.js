/* jshint node: true */
'use strict';
var VersionChecker = require('ember-cli-version-checker');
module.exports = {
  name: 'ember-cli-bundle-loader',
  included: function (app) {
    this._super.included(app);

    var checker = new VersionChecker(this);
    var emberChecker = checker.for('ember', 'bower');
    if (emberChecker.lt('2.3.0')) {
      checker.for('ember-getowner-polyfill', 'npm').assertAbove('1.2.1');
    }
  }
};
