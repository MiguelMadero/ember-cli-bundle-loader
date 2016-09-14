import Ember from 'ember';
import layout from '../templates/components/loading-for-test';

export const StateForTest = { hasRendered: false };
export default Ember.Component.extend({
  layout,
  didInsertElement () {
    // Not an easy way to prove that something render
    // since checking for a class on run.later
    // actually delays the render :(
    StateForTest.hasRendered = true;
  }
});
