/* jshint node: true */
module.exports = [
// {
//   name: 'package1',
//   // [WIP]
//   // This will be used later to concat packages into a single bundle. Right now there
//   // is a one-one mapping in config, but when we lazy-load we think of bundles not packages
//   packages: ['package1'],
//   // Specifies the routes that a particular bundle can handle. This follows the same
//   // routeName used by the router.router and applicationController.routeName
//   // for example, 'application', 'index', 'loading', 'package1', 'package1.nested', 'anotherRoute.nested.index'
//   // we use a regular expression to match, if a package handles all the nested routes
//   // you can use ['topLevelRoute'], if you need to handle only nesting, then be more specific ['topLevelRoute.nested']
//   // Keep in mind that we use a RegEx, so you normally want to do a starts with (^) to avoid matchin otherRoute.package1
//   routeNames: ['^package1']
//   // Bundles can have dependencies, which means that before loading package1 we need to load package2
//   // dependencies can be static and explicit (e.g. an import statement evaluated as part of initial code execution) or dynamic
//   // required by ember or your code, but we need to make them sync to avoid blocking a second time or make sure that Ember sync
//   // operations work like a service depedency.
//   // [WIP]
//   // dependsOn: ['package2']
// }, {
//   name: 'package2',
//   packages: ['package2'],
//   routeNames: ['^package2']
// }
];
