import Ember from 'ember';

const get = Ember.get;

export default Ember.Router.extend({
  _getHandlerFunction: function() {
    var container = this.container;
    var DefaultRoute = container.lookupFactory('route:basic');
    var LazyLoaderRoute = container.lookupFactory('route:-lazy-loader');

    var self = this;

    return function(name) {
      var routeName = 'route:' + name;
      var handler = container.lookup(routeName);
      // TODO: somehow determine if it's a route that requires lazy-loading (see bundles.js in my demo)
      var needsLazyLoading = name === 'package1' || name === 'package2';

      if (!handler) {
        if (needsLazyLoading) {
          handler = LazyLoaderRoute.create();
          handler.routeName = name;
          return handler;
        }
        container._registry.register(routeName, DefaultRoute.extend());
        handler = container.lookup(routeName);

        if (get(self, 'namespace.LOG_ACTIVE_GENERATION')) {
          Ember.Logger.info("generated -> " + routeName, { fullName: routeName });
        }
      }

      handler.routeName = name;
      return handler;
    };
  }
});
