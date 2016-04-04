/* global require */
import { moduleFor, test } from 'ember-qunit';
import configBundles from 'ember-cli-bundle-loader/config/bundles';

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

test('_getBundleConfiguration is based on config/bundles', function(assert) {
  const service = this.subject();
  const config = service._getBundleConfiguration();
  assert.equal(config[0].name, 'package1');
  assert.deepEqual(config, configBundles);
});

test('_getBundleConfiguration creates a default bundle structure based on packageNames if configBundles aren\t present', function(assert) {
  const service = this.subject({packageNames: ['my-package'], configBundles: []});
  const config = service._getBundleConfiguration();
  assert.deepEqual(config, [{
    name: 'my-package',
    packages: ['my-package'],
    urls: ['assets/my-package.js', 'assets/my-package.css'],
    handledRoutesPatterns: ['/my-package']
  }]);
});

test('_getBundleConfiguration adds all missing packageNames to the bundle, creating defaults for the packages not currently present', function(assert) {
  const service = this.subject({packageNames: ['my-package'], configBundles: configBundles});
  const config = service._getBundleConfiguration();
  assert.deepEqual(config, configBundles.concat([{
    name: 'my-package',
    packages: ['my-package'],
    urls: ['assets/my-package.js', 'assets/my-package.css'],
    handledRoutesPatterns: ['/my-package']
  }]));
});
