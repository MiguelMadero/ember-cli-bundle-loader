import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import ResourceHelper from 'ember-cli-bundle-loader/utils/-resource-helper';

moduleForAcceptance('Acceptance | loads dependent package');

test('visiting /with-dependency loads the dependent package', function(assert) {
  visit('/with-dependency');
  let lazyLoaderService = this.application.__container__.lookup('service:lazy-loader');
  assert.ok(lazyLoaderService.needsLazyLoading('dependent'));
  assert.notOk(ResourceHelper.isJavascriptLoaded('assets/dependent.js'));
  andThen(function() {
    assert.equal(currentURL(), '/with-dependency');
    assert.notOk(lazyLoaderService.needsLazyLoading('dependent'));
    assert.ok(ResourceHelper.isJavascriptLoaded('assets/dependent.js'));
  });
});
