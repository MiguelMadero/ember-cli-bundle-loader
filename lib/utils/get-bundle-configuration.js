/*jshint node:true*/

var flatten = function (list) {
  return list.reduce(function (a, b) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
};

var getDefaultUrls = function (name, rootURL) {
  return [rootURL + 'assets/' + name + '.js', rootURL + 'assets/' + name + '.css'];
};

var generateBundleWithDefaults = function generateBundleWithDefaults (name, baseBundle, rootURL) {
  return {
    name: name,
    packages: baseBundle.packages || [name],
    urls: baseBundle.urls || getDefaultUrls(name, rootURL),
    routeNames: baseBundle.routeNames || ['^' + name]
  };
};

/***
 * Returns the list of all the bundles. If a bundle isn't defined in config/bundles.js
 * a default is inferred based on the package-names where there is a one to one package-bundle,
 * the bundle has no dependencies and we load from the default URLs that Ember specified
 */
module.exports = function (bundles, packageNames, config) {
  var rootURL = (config && config.rootURL) || '';

  var bundlesWithDefaults = bundles.map(bundle =>
    generateBundleWithDefaults(bundle.name, bundle, rootURL));
  var usedPackagesNames = flatten(bundlesWithDefaults.map(bundle =>bundle.packages));
  var packageNamesWithoutBundles = packageNames.filter(name =>
    usedPackagesNames.indexOf(name) === -1);

  var bundlesForMissingPackages = packageNamesWithoutBundles.map(name =>
    generateBundleWithDefaults(name, {}, rootURL));

  return bundlesWithDefaults.concat(bundlesForMissingPackages);
};
