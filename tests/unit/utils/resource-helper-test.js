import { module, test } from 'qunit';
import ResourceHelper from 'ember-cli-bundle-loader/utils/-resource-helper';

module('Unit | Utility | resource loader');

test('loadJavascript adds the appropriate script tag to the DOM', function (assert) {
  assert.expect(2);
  let testAsset = 'assets/load-assets-test2.js';

  assert.equal(false, ResourceHelper.isJavascriptLoaded(testAsset));

  return ResourceHelper.loadJavascript(testAsset).then(function() {
    assert.equal(true, ResourceHelper.isJavascriptLoaded(testAsset));
  });
});

test('loadJavascript. The resource will not be considered as loaded if it failed', function (assert) {
  let testAsset = 'assets/dosntexist.js';

  return ResourceHelper.loadJavascript(testAsset).catch(function() {
    assert.equal(false, ResourceHelper.isJavascriptLoaded(testAsset));
  });
});

test('loadJavascript. The promise will fail if the resource cant be loaded', function (assert) {
  let testAsset = 'assets/dosntexist.js';

  return ResourceHelper.loadJavascript(testAsset).then(()=>
    assert.notOk('The promise resolved when it was expected to fail')
  ).catch(() =>
    assert.ok('The promise failed')
  );
});

test('loadStylesheet adds the appropriate stylesheet link to the DOM', function (assert) {
  assert.expect(2);
  let testAsset = 'assets/load-assets-test2.css';

  assert.equal(false, ResourceHelper.isStylesheetLoaded(testAsset));

  return ResourceHelper.loadStylesheet(testAsset).then(function() {
    assert.equal(true, ResourceHelper.isStylesheetLoaded(testAsset));
  });
});

test('loadStylesheet. The promise will fail if the resource cant be loaded', function (assert) {
  let testAsset = 'assets/dosntexist.js';

  return ResourceHelper.loadStylesheet(testAsset).then(()=>
    assert.notOk('The promise resolved when it was expected to fail')
  ).catch(() =>
    assert.ok('The promise failed')
  );
});


test('loadStylesheet. The resource will not be considered as loaded if it failed', function (assert) {
  let testAsset = 'assets/dosntexist.css';

  return ResourceHelper.loadStylesheet(testAsset).catch(function() {
    assert.equal(false, ResourceHelper.isStylesheetLoaded(testAsset));
  });
});
