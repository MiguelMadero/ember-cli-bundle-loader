import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['sort', 'page'],
  sort: 'ASC',
  page: 1
});
