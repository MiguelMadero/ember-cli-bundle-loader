## General

[x] Make catch-all routes re-usable
[x] Extract cli-build API
[x] Test the addon and generators on a new app
[x] Update README with info from packages-demo and add stuff about generators
  Document sass dependency.
[ ] Fix support for URLs
[x] Consider turning bundles.js into a service or util that the app could override
  as needed instead of keeping it in config/bundles so we can put CPs and code to resolve urls, etc.
  Note: it was a bad idea since we will use it later to do JS Concat to actually create the bundle.
  Instead the extension points will live in the existing loader service
[x] Port approvals tests from ember-cli-packages-demo
[ ] Port acceptance tests.
[ ] Test pods (Zenefits)
[x] Setup CI
[ ] Check if we need to update the resolver for tests and update the generators if we do

## Minor
[ ] Remove deprecation warnings (use getOwner API)
[ ] Use path.join instead of concatenating paths in ember-app-with-packages.js [Windows?]
[ ] Fix OOB generators for packages (e.g. ember g component my-component --package=package1), test using -ir.
[x] Decide how to run packages tests. See in-repo addons
  This depends on the RFC for in-repo addon tests.
[ ] Make it work with other history locationType (right now it only works with hash)

## Later

[ ] Add support for bundles
  [ ] Nested routes
  [ ] More than one route per bundle
  [ ] More than one package per bundle (concat)
[ ] Add support for bundle dependencies
[ ] Add support for vendor bundle dependencies


## Perf

[ ] Make sure we don't add app-boot, environment/config and other header/footer files from packages since it's already in boot.
  Consider overriding all of  `EmberApp.prototype.javascript` or at least `this.concatFiles(appJs` to remove the `app-config.js` footerFile
[ ] Test perf
[ ] See what other trees we can remove for packages

## Documentation
[ ] Add links and link-to across routes and update links RFC with the learnings
[ ] Create RFC for addons {outputFile} similar to what we do today for vendor and bower_components.
  see: https://github.com/ember-cli/rfcs/pull/28 and
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
