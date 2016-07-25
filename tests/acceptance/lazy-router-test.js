import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | lazy-router');

test('Query params are not stored in cache for bundles that are not yet loaded', function(assert) {
  visit('/');
  andThen(()=>
    visit('package1'));
  andThen(()=>
    visit('package1'));
  andThen(()=>
    visit('package2'));
  andThen(()=>
    visit('package1'));
  andThen(()=>
    visit('package2'));
  andThen(() =>
    assert.equal(find('.package2 a').attr('href'), '/package1?page=2&sort=DESC'));
});
