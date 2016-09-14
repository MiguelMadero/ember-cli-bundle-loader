import { test } from 'ember-qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import { StateForTest } from 'dummy/components/loading-for-test';

moduleForAcceptance('Acceptance | loading-substate');

test('loading-substate renders while beforeModel promise resolves', function (assert) {
  visit('/');
  visit('slow');
  andThen(() => {
    assert.ok(StateForTest.hasRendered);
    assert.equal(1, find('.slow').length);
  });
  return visit('/'); // reset this so refreshing the browser starts at the root
});
