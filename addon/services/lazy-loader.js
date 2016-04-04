/* globals require*/
import Ember from 'ember';
import routingConfigUtil from 'ember-cli-bundle-loader/utils/lazy-routing-configuration';
import configBundles from 'ember-cli-bundle-loader/config/bundles';
import packageNames from 'ember-cli-bundle-loader/config/package-names';

const A = Ember.A;
const loadedBundles = {};
const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

export default Ember.Service.extend({
  init () {
    this._super(...arguments);
    this._getBundleConfiguration().forEach(bundle=>loadedBundles[bundle.name] = false);
  },
  isBundleLoaded (bundleName) {
    return loadedBundles[bundleName];
  },
  getBundleForUrl (url) {
    return A(this._getBundleConfiguration()).find(bundle=>
      A(bundle.handledRoutesPatterns).find(pattern=>
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
  },

  /***
   * Returns the list of all the bundles. If a bundle isn't defined in config/bundles.js
   * a default is inferred based on the package-names where there is a one to one package-bundle,
   * the bundle has no dependencies and we load from the default URLs that Ember specified
   */
  _getBundleConfiguration() {
    const configCopy = this.get('configBundles').slice();
    const packagesInBundle = flatten(configCopy.map(bundle=>bundle.packages));
    const packagesMissingFromBundle = this.get('packageNames').filter(name=>
      !packagesInBundle.includes(name));
    const configForMissingPackages = packagesMissingFromBundle.map(name=>({
      name,
      packages: [name],
      urls: [`assets/${name}.js`, `assets/${name}.css`],
      handledRoutesPatterns: [`/${name}`]
    }));

    return configCopy.concat(configForMissingPackages);
  },
  // defining them here to make it easier to test
  configBundles,
  packageNames
});
