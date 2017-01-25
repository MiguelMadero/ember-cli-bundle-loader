import Ember from 'ember';
const {RSVP: {all, resolve}} = Ember;

import ResourceHelper from 'ember-cli-bundle-loader/utils/-resource-helper';

const inFlightPromises = {};
export function singleInflightPromise(key, promiseGenerator) {
  if (inFlightPromises[key]) {
    // We already have a promise for that script, return it.
    return inFlightPromises[key];
  }
  const promise = promiseGenerator();
  inFlightPromises[key] = promise;
  // When the promise is either resolved/rejected, we allow for another request
  // NOTE: we only want to prevent inflight promises, but downloading the same
  // asset more than once may be ok. lazyLoader.loadBundle already check that the
  // bundle isn't loaded before attempting to loadAssets
  promise.finally(()=> inFlightPromises[key] = undefined);
  return promise;
}

export function loadScript (url) {
  return singleInflightPromise(url, ()=> {
    if (ResourceHelper.isJavascriptLoaded(url)) {
      return resolve();
    }
    return ResourceHelper.loadJavascript(url);
  });
}

export function loadStylesheet (url) {
  return singleInflightPromise(url, ()=>{
    if (ResourceHelper.isStylesheetLoaded(url)) {
      return resolve();
    }
    return ResourceHelper.loadStylesheet(url);
  });
}

export default function loadAssets(urls = []) {
  urls = urls || [];
  const promises = urls.map(url=>
    url.match(/\.js$/) ?
      loadScript(url) :
      url.match(/\.css$/) ?
        loadStylesheet(url) :
        Ember.RSVP.reject(`The specified url (${url}) doesnt match any of the expected types`)
  );
  return all(promises);
}
