/* globals Dummy */
import Ember from 'ember';
import { getContainer, getFactory, registerFactory} from 'ember-cli-bundle-loader/utils/get-owner';
import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | get-owner');

function getSomeOwner () {
  // NOTE: getting the container like this is a bit cheating
  // but we can rely on the global being defined here for testing,
  // but no in consumign apps
  return Dummy.__container__.lookup('router:main');
}

// Replace this with your real tests.
test('can getContainer', function(assert) {
  // NOTE: getting the container like this is a bit cheating
  // but we can rely on the global being defined here for testing,
  // but no in consumign apps
  const someOwner = getSomeOwner();
  let container = getContainer(someOwner);
  assert.ok(container);
  assert.ok(container.lookup);
});

test('can getFactory', function(assert) {
  const someOwner = getSomeOwner();
  let routeBasic = getFactory(someOwner, 'router:main');
  assert.ok(routeBasic);
});

test('can registerFactory', function(assert) {
  const someOwner = getSomeOwner();
  const factoryKey = 'router:basic-randome12345';

  assert.notOk(getFactory(someOwner, factoryKey));

  registerFactory(someOwner, factoryKey, Ember.Object.extend());

  assert.ok(getFactory(someOwner, factoryKey));
});
