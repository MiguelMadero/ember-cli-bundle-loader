/* jshint node: true */
module.exports = [
// {
//   name: 'package1',
//   // [WIP]
//   // This will be used later to concat packages into a single bundle. Right now there
//   // is a one-one mapping in config, but when we lazy-load we think of bundles not packages
//   packages: ['package1'],
//   // Routes can handle more than one route segment. We have an array of array since the same bundle
//   // can handle a URL like '/package1' and '/other-url'.
//   // Each entry is an array, where each element of the nested array represents the name of the route
//   // this allows for the packages to handle "nested"
//   // For example routeNames: [['package1', 'sub-route1'], ['package4', 'sub-route2']] will handle those names
//   // and the URL (if using the defaults in the router), will look like package1/subRoute1 and package4/subRoute2
//   // routeNames: [['package1']],
//   // TODO: change it to use routeNames instead of URLs now that we move away from the catch-all route
//   // the stuff above, we can't use names from the recongnizer since the route definitions aren't loaded yet
//   // instead we use URLs for now.
//   handledRoutesPatterns: ['/package1']

//   // Bundles can have dependencies, which means that before loading package1 we need to load package2
//   // dependencies can be static and explicit (e.g. an import statement evaluated as part of initial code execution) or dynamic
//   // required by ember or your code, but we need to make them sync to avoid blocking a second time or make sure that Ember sync
//   // operations work like a service depedency.
//   // [WIP]
//   // dependsOn: ['package2']
// }, {
//   name: 'package2',
//   packages: ['package2'],
//   handledRoutesPatterns: ['/package2']
// }
];
