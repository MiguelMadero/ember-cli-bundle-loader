import Ember from 'ember';

export default Ember.Route.extend({
  debug: 'from-package1',
  model: function () {
    return new Ember.RSVP.Promise(function (resolve) {
      Ember.run.later(()=>resolve({modelProperty: 42}), 1000);
    });
  }
});
