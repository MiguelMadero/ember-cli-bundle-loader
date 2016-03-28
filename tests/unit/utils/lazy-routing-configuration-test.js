import lazyRoutingUtil from 'ember-cli-bundle-loader/utils/lazy-routing-configuration';
import Ember from 'ember';
import { module, test } from 'qunit';

let application;
module('Unit | Utility | lazy router', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

const PackageRouter = Ember.Router.extend();
PackageRouter.map(function () {
  this.route('package');
});

// Replace this with your real tests.
test('Routes from a PackageRouter are added to an initialized Router', function(assert) {
  let targetRouterInstance = application.__container__.lookup('router:main');
  targetRouterInstance.setupRouter();   // Normally done by the app, but done manually here to avoid booting everything
  assert.notOk(targetRouterInstance.router.recognizer.names["package"]);
  lazyRoutingUtil.mergeRouters(targetRouterInstance, PackageRouter);
  assert.ok(targetRouterInstance.router.recognizer.names["package"]);
});
