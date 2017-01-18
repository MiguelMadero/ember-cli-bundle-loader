import Ember from 'ember';
import sinonTest from 'ember-sinon-qunit/test-support/test';
import { module } from 'qunit';

import loadAssets from 'ember-cli-bundle-loader/utils/load-assets';
import ResourceHelper from 'ember-cli-bundle-loader/utils/resource-helper';


module('Unit | Utility | resource loader');

sinonTest('loadJavascript adds the appropriate script tag to the DOM', function (assert) {

  let testAsset = 'assets/load-assets-test2.js';

  assert.equal(false, ResourceHelper.isJavascriptLoaded(testAsset));

  return ResourceHelper.loadJavascript(testAsset).finally(function() {
    assert.equal(true, ResourceHelper.isJavascriptLoaded(testAsset));
  });
});

sinonTest('loadStylesheet adds the appropriate stylesheet link to the DOM', function (assert) {
  let testAsset = 'assets/load-assets-test2.css';

  assert.equal(false, ResourceHelper.isStylesheetLoaded(testAsset));

  return ResourceHelper.loadStylesheet(testAsset).finally(function() {
    assert.equal(true, ResourceHelper.isStylesheetLoaded(testAsset));
  });
});

sinonTest('loadAssets wont load an already loaded script', function (assert) {
  this.stub(ResourceHelper, 'isJavascriptLoaded').returns(true);
  var loaderSpy = this.spy(ResourceHelper, 'loadJavascript');

  loadAssets(['assets/doesntmatter.js']);

  assert.notOk(loaderSpy.called);
});

sinonTest('loadAssets wont load an already loaded stylesheet', function (assert) {
  this.stub(ResourceHelper, 'isStylesheetLoaded').returns(true);
  var loaderSpy = this.spy(ResourceHelper, 'loadStylesheet');

  loadAssets(['assets/doesntmatter.css']);

  assert.notOk(loaderSpy.called);
});

sinonTest('loadAssets calls the loader for javascript', function (assert) {
  this.stub(ResourceHelper, 'isJavascriptLoaded').returns(false);
  var loaderStub = this.stub(ResourceHelper, 'loadJavascript').returns(Ember.RSVP.resolve());

  loadAssets(['assets/doesntmatter.js']);

  assert.ok(loaderStub.called);
});

sinonTest('loadAssets calls the loader for stylesheets', function (assert) {
  this.stub(ResourceHelper, 'isStylesheetLoaded').returns(false);
  var loaderStub = this.stub(ResourceHelper, 'loadStylesheet').returns(Ember.RSVP.resolve());

  loadAssets(['assets/doesntmatter.css']);

  assert.ok(loaderStub.called);
});
