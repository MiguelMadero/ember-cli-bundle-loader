/* global Dummy, require */
import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance', 'lazy-loader');

function getSubject () {
  return Dummy.__container__.lookup('service:lazy-loader');
}

test('loadAssets - promise fails if one of the assets fails to load', function (assert) {
  const service = getSubject();
  return service.loadBundle('package-with-wrong-urls').then(()=>
     assert.notOk('The promise resolved when it was expected to fail')
   ).catch(() =>
     assert.ok('The promise failed')
  );
});

test('getBundleForRouteName based on the configuration', function(assert) {
  const service = getSubject();
  const actualBundle = service.getBundleForRouteName('package2');

  assert.ok(actualBundle);
  assert.equal(actualBundle.name, 'package2');
  assert.deepEqual(actualBundle.packages, ['package2']);
});

test('getBundleForRouteName based on the configuration blacklist', function(assert) {
  const service = getSubject();
  service.setBundles([{
    name: 'blacklist-test',
    // This bundle handles everything except the route starting with dashboard
    routeNames: ['.'],
    blacklistedRouteNames: ['^dashboard', '^index', '^loading']
  }]);
  const actualBundle = service.getBundleForRouteName('some-route');

  assert.ok(actualBundle);
  assert.equal(actualBundle.name, 'blacklist-test');

  assert.notOk(service.getBundleForRouteName('dashboard'));
  assert.notOk(service.getBundleForRouteName('index'));
  assert.notOk(service.getBundleForRouteName('loading'));
});

test('loadBundleForUrl evaluates the loaded code for external packages', function(assert) {
  const service = getSubject();
  assert.notOk(service.isBundleLoaded('package2'));
  // Normally this would be a separate test, but we don't have an easy way to "unload" code in the browser
  assert.notOk(
    require._eak_seen['package2/routes/package2']);

  return service.loadBundleForRouteName('package2').then(()=> {
    assert.ok(service.isBundleLoaded('package2'));
    assert.ok(require._eak_seen['package2/routes/package2']);
  });
});

test('_getRouteNamesFromUrl', function(assert) {
  const service = getSubject();
  visit('/');
  return andThen(()=> {
    assert.equal(service._getRouteNameFromUrl('/'), 'index');
    assert.equal(service._getRouteNameFromUrl('/package2'), 'package2');
    assert.equal(service._getRouteNameFromUrl('/package1/nested/1'), 'package1.nested');
    // If the URL doesn't match any route, simply null
    assert.notOk(service._getRouteNameFromUrl('/doesntmatch'));
  });
});

test('dependsOn doesnt break if nothing is specified', function(assert) {
  const service = getSubject();
  service.setBundles([{
    name: 'bundleA',
    urls: ['stuff.js'],
    // dependsOn: [],
  }]);

  var assets = namesForBundles(service.getDependentBundlesForBundle(service.getBundleByName('bundleA')));
  assert.equal(assets.length, 1);
  assert.notEqual(assets.indexOf('bundleA'), -1);
});

test('dependsOn can handle a simple dependency', function(assert) {
  const service = getSubject();
  service.setBundles([{
    name: 'bundleA',
    urls: ['stuffA.js'],
    dependsOn: ['bundleB'],
  },{
    name: 'bundleB',
    urls: ['stuffB.js'],
  }]);

  var assets = namesForBundles(service.getDependentBundlesForBundle(service.getBundleByName('bundleA')));
  assert.equal(assets.length, 2);
  assert.notEqual(assets.indexOf('bundleA'), -1);
  assert.notEqual(assets.indexOf('bundleB'), -1);
});

function namesForBundles(bundles) {
    return Ember.A(bundles).mapBy('name');
}

test('dependsOn can handle more complex dependency graphs', function(assert) {
  const service = getSubject();
  service.setBundles([{
    name: 'bundleA',
    urls: ['stuffA.js'],
    dependsOn: ['bundleB', 'bundleC'],
  },{
    name: 'bundleB',
    urls: ['stuffB.js'],
    dependsOn: ['bundleD'],
  },{
    name: 'bundleC',
    urls: ['stuffC.js'],
    dependsOn: ['bundleD'],
  },{
    name: 'bundleD',
    urls: ['stuffD.js'],
    dependsOn: ['bundleE'],
  },{
    name: 'bundleE',
    urls: ['stuffE.js'],
  }]);

  var assets = namesForBundles(service.getDependentBundlesForBundle(service.getBundleByName('bundleA')));
  assert.equal(assets.length, 5);
  assert.notEqual(assets.indexOf('bundleA'), -1);
  assert.notEqual(assets.indexOf('bundleB'), -1);
  assert.notEqual(assets.indexOf('bundleC'), -1);
  assert.notEqual(assets.indexOf('bundleD'), -1);
  assert.notEqual(assets.indexOf('bundleE'), -1);
});

test('dependsOn doesnt break for circular dependencies', function(assert) {
  const service = getSubject();
  service.setBundles([{
    name: 'bundleA',
    urls: ['stuffA.js'],
    dependsOn: ['bundleB'],
  },{
    name: 'bundleB',
    urls: ['stuffB.js'],
    dependsOn: ['bundleA'],
  }]);

  // from A..
  var assets = namesForBundles(service.getDependentBundlesForBundle(service.getBundleByName('bundleA')));
  assert.equal(assets.length, 2);
  assert.notEqual(assets.indexOf('bundleA'), -1);
  assert.notEqual(assets.indexOf('bundleB'), -1);

  // from B..
  var assets2 = namesForBundles(service.getDependentBundlesForBundle(service.getBundleByName('bundleB')));
  assert.equal(assets2.length, 2);
  assert.notEqual(assets2.indexOf('bundleA'), -1);
  assert.notEqual(assets2.indexOf('bundleB'), -1);
});

test('namesForBundles returns the bundles based on the load order specified by the dependencies', function(assert) {
  const service = getSubject();
  service.setBundles([{
    name: '1',
    dependsOn: ['2'],
  }, {
    name: '2',
    dependsOn: ['4', '3'],
  }, {
    name: '3',
    dependsOn: ['4'],
  }, {
    name: '4'
  }]);

  var assets = namesForBundles(service.getDependentBundlesForBundle(service.getBundleByName('1')));
  assert.equal(assets.length, 4);
  assert.deepEqual(assets, ['4', '3', '2', '1']);

  service.setBundles([{
    name: '1',
    dependsOn: ['2'],
  }, {
    name: '2',
    dependsOn: ['3', '4'],
  }, {
    name: '3',
    dependsOn: ['4'],
  }, {
    name: '4'
  }]);
  assets = namesForBundles(service.getDependentBundlesForBundle(service.getBundleByName('1')));
  assert.equal(assets.length, 4);
  // 3 depends on 4, so even if 2 lists 3,4, the order is 4,3
  assert.deepEqual(assets, ['4', '3', '2', '1']);
});
