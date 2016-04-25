import LazyRouter from 'ember-cli-bundle-loader/lazy-router';
import config from './config/environment';

const Router = LazyRouter.extend({
  location: config.locationType
});

Router.map(function() {

});

export default Router;
