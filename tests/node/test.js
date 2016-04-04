/*jshint node:true*/
/* global describe, it */
var assert = require('assert');
var getBundleConfiguration = require('../../lib/utils/get-bundle-configuration');
var bundles = require('../dummy/config/bundles');

describe('getBundleConfiguration', function () {
  it('is based on bundles', function () {
    const newBundles = getBundleConfiguration(bundles, []);
    assert.equal(newBundles[0].name, 'package1');
    assert.deepEqual(newBundles, bundles);
  });

  it('creates a default bundle structure based on packageNames if configBundles aren\t present', function () {
    const newBundles = getBundleConfiguration([], ['my-package']);
    assert.deepEqual(newBundles, [{
      name: 'my-package',
      packages: ['my-package'],
      urls: ['assets/my-package.js', 'assets/my-package.css'],
      handledRoutesPatterns: ['/my-package']
    }]);
  });

  it('adds all missing packageNames to the bundle, creating defaults for the packages not currently present', function () {
    const newConfig = getBundleConfiguration(bundles.slice(), ['my-package']);
    assert.deepEqual(newConfig, bundles.concat([{
      name: 'my-package',
      packages: ['my-package'],
      urls: ['assets/my-package.js', 'assets/my-package.css'],
      handledRoutesPatterns: ['/my-package']
    }]));
  });

  it('adds default URLs for packages without URLs', function () {
    const bundleConfig = [{
      name: 'my-package',
      packages: ['my-package'],
      // urls: ['assets/my-package.js', 'assets/my-package.css'],
      handledRoutesPatterns: ['/my-package']
    }];
    const newConfig = getBundleConfiguration(bundleConfig, []);
    assert.deepEqual(newConfig, [{
      name: 'my-package',
      packages: ['my-package'],
      urls: ['assets/my-package.js', 'assets/my-package.css'],
      handledRoutesPatterns: ['/my-package']
    }]);
  });
});


