/* globals require*/
import Ember from 'ember';
import bundles from 'ember-cli-bundle-loader/config/bundles';
import config from 'ember-get-config';

const A = Ember.A;
const loadedBundles = {};
bundles.forEach(bundle=>loadedBundles[bundle.name] = false);

export default Ember.Service.extend({
  needsLazyLoading (routeName) {
    var bundle = this.getBundleForRouteName(routeName);
    return bundle && !this.isBundleLoaded(bundle.name);
  },
  isBundleLoaded (bundleName) {
    return loadedBundles[bundleName];
  },
  getBundleForUrl (url) {
    return A(bundles).find(bundle=>
      A(bundle.handledRoutesPatterns).find(pattern=>
        url.match(pattern)));
  },
  getBundleForRouteName (routeName) {
    return A(bundles).find(bundle=>
      A(bundle.routeNames||[]).find(pattern=>
        routeName.match(pattern)));
  },
  loadBundleForUrl (url) {
    return this.loadBundle(this.getBundleForUrl(url));
  },
  loadBundleForRouteName (routeName) {
    return this.loadBundle(this.getBundleForRouteName(routeName));
  },
  loadBundle (bundle) {
    if (!bundle) {
      return Ember.RSVP.resolve();
    }
    if (this.isBundleLoaded(bundle.name)) {
      return Ember.RSVP.resolve();
    }

    return this._loadAssets(bundle).then(()=>{
      loadedBundles[bundle.name] = true;
    });
  },

  _getPackageRouter(packageName) {
    return require._eak_seen[`${packageName}/router`] ?
      require(`${packageName}/router`) :
      require(`${config.modulePrefix}/${packageName}-router`);        // For cases where the package and main-app share a namespace.
  },

  _loadAssets (bundle) {
    const urls = bundle.urls || [];
    const promises = urls.map(url=>
      url.match(/\.js$/) ?
        this._loadScript(url) :
        url.match(/\.css$/) ?
          this._loadStylesheet(url) :
          Ember.RSVP.reject(`The specified url (${url}) for bundle ${bundle.name} doesnt match any of the expected types`)
    );
    return Ember.RSVP.all(promises);
  },

  // TODO: extract to a util.
  _loadScript (url) {
    var scriptElement = Ember.$("<script>").prop({src: url, async: true});
    let promise = new Ember.RSVP.Promise((resolve, reject)=>{
      scriptElement.one('load', ()=> Ember.run(null, resolve));
      scriptElement.one('error', (evt)=> Ember.run(null, reject, evt));
    });
    document.head.appendChild(scriptElement[0]);
    return promise;
  },
  // TODO: extract to a util.
  _loadStylesheet (url) {
    let linkElement = Ember.$(`<link rel="stylesheet" href="${url}" type="text/css"/>`);
    let promise = new Ember.RSVP.Promise((resolve, reject)=>{
      linkElement.one('load', ()=> Ember.run(null, resolve));
      linkElement.one('error', (evt)=> Ember.run(null, reject, evt));
    });
    document.head.appendChild(linkElement[0]);
    return promise;
  }
});
