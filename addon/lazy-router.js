import Ember from 'ember';

const { get, getOwner } = Ember;

export default Ember.Router.extend({
  _getHandlerFunction: function() {
    var container = this._getContainer();
    var DefaultRoute = this._getFactory('route:basic');
    var LazyLoaderRoute =this._getFactory('route:-lazy-loader');
    var lazyLoaderService = container.lookup('service:lazy-loader');

    var _this = this;

    return function(name) {
      var routeName = 'route:' + name;
      var lazyRouteName = routeName + '.lazy';
      var handler = container.lookup(routeName);
      var needsLazyLoading = !!lazyLoaderService.needsLazyLoading(name);

      if (!handler) {
        if (needsLazyLoading) {
          handler = container.lookup(lazyRouteName);
          if (!handler) {
            _this._registerFactory(lazyRouteName, LazyLoaderRoute.extend());
            handler = container.lookup(lazyRouteName);
            handler.routeName = name + '-lazy';
          }
          return handler;
        }
        _this._registerFactory(routeName, DefaultRoute.extend());
        handler = container.lookup(routeName);

        if (get(_this, 'namespace.LOG_ACTIVE_GENERATION')) {
          Ember.Logger.info("generated -> " + routeName, { fullName: routeName });
        }
      }

      handler.routeName = name;
      return handler;
    };
  },
  _getContainer: function() {
    var hasGetOwner = typeof getOwner === "function";
    var container = hasGetOwner? getOwner(this) : this.container;
    return container;
  },
  _getFactory: function(factoryName){
    var container = this._getContainer();
    var factory = typeof container.lookupFactory === "function" ? container.lookupFactory(factoryName) : container._lookupFactory(factoryName);
    return factory;
  },
  _registerFactory: function(fullName, factory) {
    var container = this._getContainer();
    var hasGetOwner = typeof getOwner === "function";
    if (hasGetOwner) {
      container.base.register(fullName, factory);
      return;
    }
    var registry = container._registry || container.registry;
    registry.register(fullName, factory);
  },
  _queryParamsFor: function(leafRouteName) {
    var superQueryParams = this._super(...arguments);
    var container = this._getContainer();
    var lazyLoaderService = container.lookup('service:lazy-loader');
    var needsLazyLoading = !!lazyLoaderService.needsLazyLoading(leafRouteName);
    //If the bundle is not yet loaded, the qps for the routes in the bundle will be stored as empty in `_qpCache`.
    //Hence remove the qps of routes that are not yet loaded from `qpCache`
    if (needsLazyLoading) {
      delete this._qpCache[leafRouteName];
    }
    return superQueryParams;
  }
});
