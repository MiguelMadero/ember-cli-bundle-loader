// NOTE: this file was renamed to a-resolver-test to make sure it’s loaded before other acceptance test.
// This is unfortunate an unnecessary likely it’s the symptom of a larger issue

/* global require */
import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | resolver');

test('Can resolve routes from the boot app and packages', function(assert) {
  assert.ok(this.application.__container__.lookup('route:application') instanceof
    require('dummy/routes/application').default);

  assert.notOk(
    this.application.__container__.lookup('route:package1'));
  visit('package1');
  andThen(()=>
    assert.ok(this.application.__container__.lookup('route:package1') instanceof
      require('package1/routes/package1').default));
  visit('/'); // reset this so refreshing the browser starts at the root
});
