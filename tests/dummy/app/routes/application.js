import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    manualTransition() {
      this.get('router')._doTransition('package1', [], []);
    }
  }
});
