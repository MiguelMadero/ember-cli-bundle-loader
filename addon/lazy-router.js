import Ember from 'ember';
const { get, isArray } = Ember;
import { getContainer, getFactory, registerFactory } from 'ember-cli-bundle-loader/utils/get-owner';

export default Ember.Router.extend({
  _getHandlerFunction: function() {
    var container = getContainer(this);
    var DefaultRoute = getFactory(this, 'route:basic');
    var LazyLoaderRoute =getFactory(this, 'route:-lazy-loader');
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
            registerFactory(_this, lazyRouteName, LazyLoaderRoute.extend());
            handler = container.lookup(lazyRouteName);
            handler.routeName = name + '-lazy';
          }
          return handler;
        }
        registerFactory(_this, routeName, DefaultRoute.extend());
        handler = container.lookup(routeName);

        if (get(_this, 'namespace.LOG_ACTIVE_GENERATION')) {
          Ember.Logger.info("generated -> " + routeName, { fullName: routeName });
        }
      }

      if (typeof handler._setRouteName === 'function') {
        handler._setRouteName(name);
        // handler._populateQPMeta function removed in Ember 2.13
        if (handler._populateQPMeta) { 
          handler._populateQPMeta();
        }
      } else {
        handler.routeName = name;
      }
      return handler;
    };
  },

  _queryParamsFor: function(handlerInfosOrLeafRouteName) {
    var leafRouteName = isArray(handlerInfosOrLeafRouteName) ? handlerInfosOrLeafRouteName[handlerInfosOrLeafRouteName.length - 1].name : handlerInfosOrLeafRouteName;
    var superQueryParams = this._super(...arguments);
    var container = getContainer(this);
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
