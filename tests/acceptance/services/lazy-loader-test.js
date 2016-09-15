/* global Dummy, require */
import { test } from 'ember-qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance', 'lazy-loader');

function getSubject () {
  return Dummy.__container__.lookup('service:lazy-loader');
}

test('gets the bundle for a particular URL based on the configuration', function(assert) {
  const service = getSubject();
  const actualBundle = service.getBundleForRouteName('package2');

  assert.ok(actualBundle);
  assert.equal(actualBundle.name, 'package2');
  assert.deepEqual(actualBundle.packages, ['package2']);
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

test('_loadAssets throws if the bundle.urls dont have any of the valid extensions', function(assert) {
  return getSubject()._loadAssets({name: 'my-bundle', urls: ['invalidextensions.exe']}).then(function() {
    assert.ok(false, 'promise should not be fulfilled');
  }).catch(function (error) {
    assert.ok(error.match(/for bundle my-bundle/));
  });
});
