## General

[x] Make catch-all routes re-usable
[x] Extract cli-build API
[x] Test the addon and generators on a new app
[x] Update README with info from packages-demo and add stuff about generators
  Document sass dependency.
[ ] Fix support for URLs
[ ] Consider turning bundles.js into a service or util that the app could override
  as needed instead of keeping it in config/bundles so we can put CPs and code to resolve urls, etc.
[ ] Port approvals tests from ember-cli-packages-demo
[ ] Port acceptance tests.
[ ] Test pods (Zenefits)
[x] Setup CI
[ ] Check if we need to update the resolver for tests and update the generators if we do

## Minor
[ ] Remove deprecation warnings (use getOwner API)
[ ] Fix generators for packages (e.g. ember g component my-component --package=package1).
  Check how in-repo addons work today.
[ ] Decide how to run packages tests. See in-repo addons
[ ] Make it work with other history locationType (right now it only works with hash)
[ ] Use path.join instead of concatenating paths in ember-app-with-packages.js [Windows?]

## Later

[ ] Add support for bundles
  [ ] Nested routes
  [ ] More than one route per bundle
  [ ] More than one package per bundle (concat)
  [ ] Manage dependencies


## Perf

[ ] Remove environment/config from packages since it's already in boot.
  Consider overriding all of  `EmberApp.prototype.javascript` or at least `this.concatFiles(appJs` to remove the `app-config.js` footerFile
[ ] Test perf

## Documentation
[ ] Add links and link-to across routes and update links RFC with the learnings
[ ] Create RFC for addons {outputFile} similar to what we do today for vendor and bower_components.
[ ] Write RFC for tests for in-repo addongs/engines/packages (see https://github.com/ember-cli/ember-cli/issues/4461)

## Old todos for reference (from ember-cli-package-demo)
[x] Add tests to make sure the files are split and small (node tests)
[x] Bring packages-resolver (and hard code JS)
[x] Move packages to packages/
[x] Lazy load JS
  [x] Split Router.map?
  [x] Dynamically determine the package to load for a given route
  [x] Test LOG_TRANSITIONS_INTERNAL
  [x] Test Engines to ensure allignment
[x] Lazy load CSS


## Reuse

[x] Consider splitting for better re-use
  Move to an addon:
    [x] package-name generator and add them to config/environment changes to get packageNames
    [x] bundle
    create a Package object that inherits from EmberApp and takes a config override to clean ember-cli-build
    Create an EmberAppWithPackages app that does packages and app and takes overrides for both.
    Expose from addon
    [x] resolver
    [x] service:lazy-loader,
    [x] util:lazy-routing-configuration
    [x] catch-all route
