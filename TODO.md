## General

- [x] Make catch-all routes re-usable
- [x] Extract cli-build API
- [x] Test the addon and generators on a new app
- [x] Update README with info from packages-demo and add stuff about generators
  Document sass dependency.
- [x] Fix support for URLs
- [x] Consider turning bundles.js into a service or util that the app could override
  as needed instead of keeping it in config/bundles so we can put CPs and code to resolve urls, etc.
  Note: it was a bad idea since we will use it later to do JS Concat to actually create the bundle.
  Instead the extension points will live in the existing loader service
- [x] Port approvals tests from ember-cli-packages-demo
- [x] Port acceptance tests.

- [ ] TODO: verify: Fix link-to helper (add a new one or ditch catch-all in favor of route mixin)
  - [ ] Add acceptance test for deep-link, manual transition, anchor tag, normal link-to, link-to with model and nested routes
  - [ ] Implement `needsLazyLoading` in lazyRouter
  - [ ] Gracefully handle cases when a bundle can't be resolved
  - [ ] TODO: verify: Better error handling for promises for catch-all route (or move away from catch-all)
  - [ ] Fix tests for other ember versions (see 93e85db4ba)
    - [ ] Change handledRoutesPatterns to use routeName instead of urls
    - [ ] Check if we still need locationType of hash

- [x] Test pods
?- [x] Add support to override the namespace for packages. 
- [x] Setup CI
- [ ] Check if we need to update the resolver for tests and update the generators if we do
- [x] Make sure the loadScript promise works fine for crossOrigin (e.g. CDN). 
  For same origin jquery simply does an eval and then calls `done`. Which works fine. 
  For different origin it will add a script tag and it might call done before the script is executed, meaning that the router won't be available, see: [SO question](http://stackoverflow.com/questions/1130921/is-the-callback-on-jquerys-getscript-unreliable-or-am-i-doing-something-wrong). All the answers are horrible. 
  Possible solution: search for Dynamically importing scripts in [this article](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement). 
  We should basically do the same we're doing for links elements. 


## From yp
[ ] Fix the "isAddon" check in loader-bundler and add back
[x] Add flexibily to specify a perPackageConfig
[x] Add flexibility to specify a different path for the boot app
[x] Add flexibility to specify a different path for each package

## Minor
- [ ] Remove deprecation warnings (use getOwner API)
- [ ] Fix watch for bundle.js and package-names.js
- [ ] Avoid loading the bundle a second time. Right now I set the loadedBundles to true *after* the assets for that bundle are loader, that doesn't consider that someone can initiate a second request while the first one is in flight. I should return store the promise on the first request and return that on every subsequent call to `loadBundle`
- [ ] Should we make this work with SRI? 
- [ ] Use path.join instead of concatenating paths in ember-app-with-packages.js [Windows?]
- [ ] Fix OOB generators for packages (e.g. ember g component my-component --package=package1), test using -ir. 
- [x] Decide how to run packages tests. See in-repo addons
  This depends on the RFC for in-repo addon tests.
- [ ] Make it work with other history locationType (right now it only works with hash)

## Later

- [ ] Add support for bundles
  - [ ] Nested routes
  - [ ] More than one route per bundle
  - [ ] More than one package per bundle (concat)
- [ ] Add support for bundle dependencies
  - [ ] Make sure a bundle is marked as "loaded" (or the promise re-used) if it was loaded as a dependency for another bundle. 
- [ ] Add support for vendor bundle dependencies


## Perf

- [ ] Make sure we don't add app-boot, environment/config and other header/footer files from packages since it's already in boot.
  Consider overriding all of  `EmberApp.prototype.javascript` or at least `this.concatFiles(appJs` to remove the `app-config.js` footerFile
- [ ] Test perf
- [ ] See what other trees we can remove for packages

## Documentation
- [ ] Add links and link-to across routes and update links RFC with the learnings
- [ ] Create RFC for addons {outputFile} similar to what we do today for vendor and bower_components.
  see: https://github.com/ember-cli/rfcs/pull/28 and
- [ ] Write RFC for tests for in-repo addongs/engines/packages (see https://github.com/ember-cli/ember-cli/issues/4461 and https://github.com/ember-cli/rfcs/issues/44)

## Old todos for reference (from ember-cli-package-demo)
- [x] Add tests to make sure the files are split and small (node tests)
- [x] Bring packages-resolver (and hard code JS)
- [x] Move packages to packages/
- [x] Lazy load JS
  - [x] Split Router.map?
  - [x] Dynamically determine the package to load for a given route
  - [x] Test LOG_TRANSITIONS_INTERNAL
  - [x] Test Engines to ensure allignment
- [x] Lazy load CSS


## Reuse

- [x] Consider splitting for better re-use
  Move to an addon:
    - [x] package-name generator and add them to config/environment changes to get packageNames
    - [x] bundle
    create a Package object that inherits from EmberApp and takes a config override to clean ember-cli-build
    Create an EmberAppWithPackages app that does packages and app and takes overrides for both.
    Expose from addon
    - [x] resolver
    - [x] service:lazy-loader,
    - [x] util:lazy-routing-configuration
    - [x] catch-all route
