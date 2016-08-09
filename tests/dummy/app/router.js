import LazyRouter from 'ember-cli-bundle-loader/lazy-router';
import config from './config/environment';

const Router = LazyRouter.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('boot');
  this.route('package1', function () {
    this.route('nested', {path: 'nested/:id'});
  });
  this.route('package2');
  this.route('link-source');
  this.route('link-target');
});

export default Router;
