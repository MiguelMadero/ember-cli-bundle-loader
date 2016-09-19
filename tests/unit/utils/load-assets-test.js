import loadAssets, { singleInflightPromise } from 'ember-cli-bundle-loader/utils/load-assets';
import { module, test } from 'qunit';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

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

test('loadAssets doesn\'t add more than one script tag for inflight promises', function (assert) {
  assert.equal(0, $('script[src="assets/load-assets-test.js"]').length);
  assert.equal(0, $('link[href="assets/load-assets-test.css"]').length);
  loadAssets(['assets/load-assets-test.js', 'assets/load-assets-test.css']);
  loadAssets(['assets/load-assets-test.js', 'assets/load-assets-test.css']);
  loadAssets(['assets/load-assets-test.js', 'assets/load-assets-test.css']);
  loadAssets(['assets/load-assets-test.js', 'assets/load-assets-test.css']).finally(function() {
    assert.equal(1, $('script[src="assets/load-assets-test.js"]').length);
    assert.equal(1, $('link[href="assets/load-assets-test.css"]').length);
  });
  return wait();
});

test('loadAssets throws if the urls dont have any of the valid extensions', function(assert) {
  return loadAssets(['invalidextensions.exe']).then(function() {
    assert.ok(false, 'promise should not be fulfilled');
  }).catch(function (error) {
    assert.ok(error.match(/The specified url /));
  });
});
