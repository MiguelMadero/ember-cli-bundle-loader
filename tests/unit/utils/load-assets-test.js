import loadAssets, { singleInflightPromise } from 'ember-cli-bundle-loader/utils/load-assets';
import { module, test } from 'qunit';
import sinonTest from 'ember-sinon-qunit/test-support/test';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';
import ResourceHelper from 'ember-cli-bundle-loader/utils/-resource-helper';

module('Unit | Utility | load assets');

test('singleInflightPromise returns the same promise on subsequent calls until the first one is settled', function(assert) {
  assert.expect(3);

  let resolve;
  const promise = new Ember.RSVP.Promise(r=>resolve =r);
  let returnedPromise = singleInflightPromise('test-key', ()=>promise);
  assert.strictEqual(promise, returnedPromise);

  returnedPromise = singleInflightPromise('test-key', ()=>new Ember.RSVP.Promise(()=>{}));
  assert.strictEqual(promise, returnedPromise);

  resolve(); // Settling the promise should result in a different promise being returned
  return wait().then(() => {
    returnedPromise = singleInflightPromise('test-key', ()=>new Ember.RSVP.Promise(()=>{}));
    assert.notStrictEqual(promise, returnedPromise);
  });
});

test('load assets only requests one asset load for in-flight promises', function (assert) {
  assert.equal(0, $('script[src="assets/load-assets-test.js"]').length);
  assert.equal(0, $('link[href="assets/load-assets-test.css"]').length);
  loadAssets(['assets/load-assets-test.js', 'assets/load-assets-test.css']);
  loadAssets(['assets/load-assets-test.js', 'assets/load-assets-test.css']);
  loadAssets(['assets/load-assets-test.js', 'assets/load-assets-test.css']);
  return loadAssets(['assets/load-assets-test.js', 'assets/load-assets-test.css']).finally(function() {
    assert.equal(1, $('script[src="assets/load-assets-test.js"]').length);
    assert.equal(1, $('link[href="assets/load-assets-test.css"]').length);
  });
});

test('loadAssets throws if the urls dont have any of the valid extensions', function(assert) {
  return loadAssets(['invalidextensions.exe']).then(function() {
    assert.ok(false, 'promise should not be fulfilled');
  }).catch(function (error) {
    assert.ok(error.match(/The specified url /));
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
