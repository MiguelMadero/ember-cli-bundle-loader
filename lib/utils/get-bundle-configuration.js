/*jshint node:true*/

const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const getDefaultUrls = (name) => [`assets/${name}.js`, `assets/${name}.css`];

/***
 * Returns the list of all the bundles. If a bundle isn't defined in config/bundles.js
 * a default is inferred based on the package-names where there is a one to one package-bundle,
 * the bundle has no dependencies and we load from the default URLs that Ember specified
 */

module.exports = function (bundles, packageNames) {
  const configCopy = bundles.slice();
  const packagesInBundle = flatten(configCopy.map(bundle=>bundle.packages));
  const packagesMissingFromBundle = packageNames.filter(name=>
    packagesInBundle.indexOf(name) === -1);
  const configForMissingPackages = packagesMissingFromBundle.map(name=>({
    name,
    packages: [name],
    urls: getDefaultUrls(name),
    handledRoutesPatterns: [`/${name}`]
  }));

  configCopy.forEach(bundle=>{
    if (!bundle.urls) {
      bundle.urls = getDefaultUrls(bundle.name);
    }
  });

  return configCopy.concat(configForMissingPackages);
};
