import { test, skip } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | query-params');

skip('Query params are not stored in cache for bundles that are not yet loaded', function(assert) {
  visit('/');
  visit('link-target');
  visit('link-target');
  visit('link-source');
  visit('link-target');
  visit('link-source');
  andThen(() =>
    assert.equal(find('.link-source a').attr('href'), '/link-target?page=2&sort=DESC'));
  return visit('/'); // reset this so refreshing the browser starts at the root
});
