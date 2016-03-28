import Ember from 'ember';

function getDSL (PackageRouter) {
  // Extracted from Ember, might not work in >1.11
  var dslCallbacks = PackageRouter.dslCallbacks;
  var dsl = new Ember.RouterDSL(null, {
    // enableLoadingSubstates: !!moduleBasedResolver
    enableLoadingSubstates: false
  });

  function generateDSL() {
    this.resource('application', { path: "/", overrideNameAssertion: true }, function() {
      for (var i=0; i < dslCallbacks.length; i++) {
        dslCallbacks[i].call(this);
      }
    });
  }

  generateDSL.call(dsl);
  return dsl.generate();
}

export function mergeRouters(targetRouterInstance, PackageRouter) {
  targetRouterInstance.router.recognizer.map(getDSL(PackageRouter), function(recognizer, routes) {
    for (var i = routes.length - 1, proceed = true; i >= 0 && proceed; --i) {
      var route = routes[i];
      recognizer.add(routes, { as: route.handler });
      proceed = route.path === '/' || route.path === '' || route.handler.slice(-6) === '.index';
    }
  });
}
