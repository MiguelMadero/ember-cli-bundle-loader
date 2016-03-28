/* globals require*/
import Ember from 'ember';
import routingConfigUtil from 'ember-cli-bundle-loader/utils/lazy-routing-configuration';
import config from 'ember-get-config';

const loadedBundles = {};
config.bundles.forEach(bundle=>loadedBundles[bundle.name] = false);

export default Ember.Service.extend({
  // TODO: consider moving to  really need to inject this or if it's better to get as an import as @nathanhammond suggested
  // TODO: consider removing the $ dependency
  // ajax: Ember.inject.service(),
  isBundleLoaded (bundleName) {
    return loadedBundles[bundleName];
  },
  getBundleForUrl (url) {
    return config.bundles.find(bundle=>
      bundle.handledRoutesPatterns.any(pattern=>
        url.match(pattern)));
  },
  loadBundleForUrl (url) {
    return this.loadBundle(this.getBundleForUrl(url));
  },
  loadBundle (bundle) {
    if (this.isBundleLoaded(bundle.name)) {
      return Ember.RSVP.resolve();
    }
    let promises = [this._loadStylesheet(`/assets/${bundle.name}.css`),
      this._loadScript(`/assets/${bundle.name}.js`)];

    return Ember.RSVP.all(promises).then(()=>{
      loadedBundles[bundle.name] = true;
      bundle.packages.forEach(packageName=>{
        this._addRoutesForPackage(packageName);
      });
    });
  },
  _addRoutesForPackage (packageName) {
    const MainRouter = this.get('container').lookup('router:main');
    const PackageRouter = require(`${packageName}/router`);
    if (PackageRouter && PackageRouter.default) {
      routingConfigUtil.mergeRouters(MainRouter, PackageRouter.default);
    }
  },

  // TODO: extract to a util.
  _loadScript (url) {
    // TODO: change to use ember-ajax instead of $.getScript
    return new Ember.RSVP.Promise((resolve, reject)=>{
      const get = Ember.$.ajax({
        dataType: 'script',
        cache: true,
        url
      });
      get.done(()=> Ember.run(null, resolve));
      get.fail((jqXHR)=>Ember.run(null, reject, jqXHR));
    });
  },
  // TODO: extract to a util.
  _loadStylesheet (url) {
    let linkElement = Ember.$(`<link rel="stylesheet" href="${url}" type="text/css"/>`);
    let promise = new Ember.RSVP.Promise((resolve, reject)=>{
      linkElement.one('load', ()=> Ember.run(null, resolve));
      linkElement.one('error', (evt)=> Ember.run(null, reject, evt));
    });
    Ember.$('head').append(linkElement);
    return promise;
    // Consider dropping the dependency on jquery
    // // Create the <style> tag
    // var style = document.createElement("style");

    // // Add a media (and/or media query) here if you'd like!
    // // style.setAttribute("media", "screen")
    // // style.setAttribute("media", "only screen and (max-width : 1024px)")

    // // WebKit hack :(
    // style.appendChild(document.createTextNode(""));

    // // Add the <style> element to the page
    // document.head.appendChild(style);

    // return style.sheet;
  }
});
