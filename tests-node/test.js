/*jshint node:true*/
/* global describe, it */
var assert = require('assert');
var getBundleConfiguration = require('../lib/utils/get-bundle-configuration');
var bundles = require('../tests/dummy/config/bundles');

if (process.env['EMBER_TRY_SCENARIO'] && process.env['EMBER_TRY_SCENARIO'] !== 'ember-1-13') {
  return;
}

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
      routeNames: ['^my-package']
    }]);
  });

  it('adds all missing packageNames to the bundle, creating defaults for the packages not currently present', function () {
    const newConfig = getBundleConfiguration(bundles.slice(), ['my-package']);
    assert.deepEqual(newConfig, bundles.concat([{
      name: 'my-package',
      packages: ['my-package'],
      routeNames: ['^my-package'],
      urls: ['assets/my-package.js', 'assets/my-package.css'],
    }]));
  });

  it('adds default URLs for packages without URLs', function () {
    const bundleConfig = [{
      name: 'my-package',
      packages: ['my-package'],
      // urls: ['assets/my-package.js', 'assets/my-package.css'],
    }];
    const newConfig = getBundleConfiguration(bundleConfig, []);
    assert.deepEqual(newConfig, [{
      name: 'my-package',
      packages: ['my-package'],
      urls: ['assets/my-package.js', 'assets/my-package.css'],
    }]);
  });

  it('default URLs include the rootURL based on the config', function () {
    const bundleConfig = [{
      name: 'my-package',
      packages: ['my-package'],
      // urls: ['assets/my-package.js', 'assets/my-package.css'],
    }];
    const newConfig = getBundleConfiguration(bundleConfig, [], {rootURL: '/static/client-app/'});
    assert.deepEqual(newConfig, [{
      name: 'my-package',
      packages: ['my-package'],
      urls: ['/static/client-app/assets/my-package.js', '/static/client-app/assets/my-package.css'],
    }]);
  });
});


