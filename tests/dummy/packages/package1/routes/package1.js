import Ember from 'ember';

export default Ember.Route.extend({
  debug: 'from-package1',
  model: function () {
    return {modelProperty: 42};
  }
});
