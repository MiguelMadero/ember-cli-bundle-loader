import Ember from 'ember';
const {$, RSVP: {all}} = Ember;

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
    var scriptElement = $("<script>").prop({src: url, async: true});
    let promise = new Ember.RSVP.Promise((resolve, reject)=>{
      scriptElement.one('load', ()=> Ember.run(null, resolve));
      scriptElement.one('error', (evt)=> Ember.run(null, reject, evt));
    });
    document.head.appendChild(scriptElement[0]);
    return promise;
  });
}

export function loadStylesheet (url) {
  return singleInflightPromise(url, ()=>{
    let linkElement = $(`<link rel="stylesheet" href="${url}" type="text/css"/>`);
    let promise = new Ember.RSVP.Promise((resolve, reject)=>{
      linkElement.one('load', ()=> Ember.run(null, resolve));
      linkElement.one('error', (evt)=> Ember.run(null, reject, evt));
    });
    document.head.appendChild(linkElement[0]);
    return promise;
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
