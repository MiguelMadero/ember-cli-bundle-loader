import Ember from 'ember';
import config from 'ember-get-config';
const {get, $} = Ember;

export default {
  loadJavascript(url) {
    let async = get(config, 'ember-cli-bundle-loader.asyncScriptExecution');
    if (async === undefined) {
      // For backwards compatibility we use async true
      async = true;
    }

    var scriptElement = $("<script>").prop({src: url, async });
    let promise = new Ember.RSVP.Promise((resolve, reject)=>{
      scriptElement.one('load', ()=> Ember.run(null, resolve));
      scriptElement.one('error', (evt)=> Ember.run(null, reject, evt));
    }).catch(()=>document.head.removeChild(scriptElement[0]));
    document.head.appendChild(scriptElement[0]);

    return promise;
  },
  isJavascriptLoaded(url) {
    return !!document.querySelector(`script[src="${url}"]`);
  },
  loadStylesheet(url) {
    let linkElement = $(`<link rel="stylesheet" href="${url}" type="text/css"/>`);
    let promise = new Ember.RSVP.Promise((resolve, reject)=>{
      linkElement.one('load', ()=> Ember.run(null, resolve));
      linkElement.one('error', (evt)=> Ember.run(null, reject, evt));
    }).catch(()=>document.head.removeChild(linkElement[0]));
    document.head.appendChild(linkElement[0]);

    return promise;
  },
  isStylesheetLoaded(url) {
    return !!document.querySelector(`link[href="${url}"]`);
  },
};
