/* jshint node: true */
module.exports = [{
  name: 'package1',
  // [WIP]
  // This will be used later to concat packages into a single bundle. Right now there
  // is a one-one mapping in config, but when we lazy-load we think of bundles not packages
  packages: ['package1'],
  // Optional url, if not specified we will use ember's defaults.
  // this names will be used for fingerprinting, so for prod builds, if AssetRev finds it,
  // it will be fingerprinted and the URL field updated
  urls: ['assets/package1.js','assets/package1.css'],

  routeNames: ['^package1'],
  // [WIP]
  // dependsOn: ['package2']
}
  // The defaults are inferred by the packages (one to one, default URLs and top level route)
  // , {
  //   name: 'package2',
  //   packages: ['package2'],
  //   urls: ['assets/package2.js','assets/package2.css'],
  //   routeNames: [^package2]
  // }
];
