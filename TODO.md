## General 

[x] Make catch-all routes re-usable
[x] Extract cli-build API
[x] Test the addon and generators on a new app 
[ ] Port approvals tests from ember-cli-packages-demo
[ ] Port acceptance tests. 
[ ] Update README with info from packages-demo and add stuff about generators
  Document sass dependency. 
[ ] Test pods (Zenefits)
[x] Setup CI

## Minor
[ ] Remove deprecation warnings (use getOwner API)
[ ] Fix generators for packages (e.g. ember g component my-component --package=package1)
[ ] Decide how to run packages tests. See engines.
[ ] Make it work with other history locationType (right now it only works with hash)

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
