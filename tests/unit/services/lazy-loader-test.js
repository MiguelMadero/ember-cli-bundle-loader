/* global require */
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:lazy-loader', 'Unit | Service | lazy loader');

test('gets the bundle for a particular URL basedon the configuration', function(assert) {
  const service = this.subject();
  const actualBundle = service.getBundleForUrl('/package2');

  assert.ok(actualBundle);
  assert.equal(actualBundle.name, 'package2');
  assert.deepEqual(actualBundle.packages, ['package2']);
});

test('loadBundleForUrl evaluates the loaded code for external packages', function(assert) {
  const service = this.subject();
  window.sinon.stub(service, '_addRoutesForPackage'); // avoid merging routes. We test this from an Acceptance Test with a full app
  assert.notOk(service.isBundleLoaded('package2'));
  // Normally this would be a separate test, but we don't have an easy way to "unload" code in the browser
  assert.notOk(
    require._eak_seen['package2/routes/package2']);

  return service.loadBundleForUrl('/package2').then(()=> {
    assert.ok(service.isBundleLoaded('package2'));
    assert.ok(require._eak_seen['package2/routes/package2']);

    // normally this would be a separate test, but we can't onload JS
    // loadBundleForUrl doesn't do a second request.
    return service.loadBundleForUrl('/package2').then(()=> {
      // TODO: assert there was a single request
    });
  });
});
