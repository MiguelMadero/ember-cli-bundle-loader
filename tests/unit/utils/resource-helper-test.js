import { module, test } from 'qunit';
import ResourceHelper from 'ember-cli-bundle-loader/utils/-resource-helper';

module('Unit | Utility | resource loader');

test('loadJavascript adds the appropriate script tag to the DOM', function (assert) {

  let testAsset = 'assets/load-assets-test2.js';

  assert.equal(false, ResourceHelper.isJavascriptLoaded(testAsset));

  return ResourceHelper.loadJavascript(testAsset).finally(function() {
    assert.equal(true, ResourceHelper.isJavascriptLoaded(testAsset));
  });
});

test('loadJavascript. The resource will not be considered as loaded if it failed', function (assert) {
  let testAsset = 'assets/dosntexist.js';

  return ResourceHelper.loadJavascript(testAsset).finally(function() {
    assert.equal(false, ResourceHelper.isJavascriptLoaded(testAsset));
  });
});

test('loadStylesheet adds the appropriate stylesheet link to the DOM', function (assert) {
  let testAsset = 'assets/load-assets-test2.css';

  assert.equal(false, ResourceHelper.isStylesheetLoaded(testAsset));

  return ResourceHelper.loadStylesheet(testAsset).finally(function() {
    assert.equal(true, ResourceHelper.isStylesheetLoaded(testAsset));
  });
});

test('loadStylesheet. The resource will not be considered as loaded if it failed', function (assert) {
  let testAsset = 'assets/dosntexist.css';

  return ResourceHelper.loadStylesheet(testAsset).finally(function() {
    assert.equal(false, ResourceHelper.isStylesheetLoaded(testAsset));
  });
});
