/*jshint node:true*/

var flatten = function (list) {
  return list.reduce(function (a, b) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
};

var getDefaultUrls = function (name, rootURL) {
  return [rootURL + 'assets/' + name + '.js', rootURL + 'assets/' + name + '.css'];
};

/***
 * Returns the list of all the bundles. If a bundle isn't defined in config/bundles.js
 * a default is inferred based on the package-names where there is a one to one package-bundle,
 * the bundle has no dependencies and we load from the default URLs that Ember specified
 */

module.exports = function (bundles, packageNames, config) {
  var rootURL = (config && config.rootURL) || '';

  var configCopy = bundles.slice();
  var packagesInBundle = flatten(configCopy.map(function (bundle) {
    return bundle.packages;
  }));
  var packagesMissingFromBundle = packageNames.filter(function (name) {
    return packagesInBundle.indexOf(name) === -1;
  });
  var configForMissingPackages = packagesMissingFromBundle.map(function (name) {
    return {
      name: name,
      packages: [name],
      urls: getDefaultUrls(name, rootURL),
      routeNames: ['^' + name],
    };
  });

  configCopy.forEach(function (bundle) {
    if (!bundle.urls) {
      bundle.urls = getDefaultUrls(bundle.name, rootURL);
    }
  });

  return configCopy.concat(configForMissingPackages);
};
