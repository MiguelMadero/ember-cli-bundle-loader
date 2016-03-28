/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
  EmberAddon = require('ember-cli/lib/broccoli/ember-addon'),
  Funnel = require('broccoli-funnel'),
  mergeTrees = require('broccoli-merge-trees'),
  packageNames = require('./tests/dummy/config/package-names'),
  AssetRev = require('broccoli-asset-rev');

// TODO: future API for packagin
// var emberApp = EmberAppWithPackages({
//   sharedConfig: {},
//   mainAppConfig: {},
//   packagesConfig: {}
// });

// return emberApp.toTree();
// packageNames = ['package1'];
// packageNames = [];
module.exports = function(defaults) {
  var env = process.env.EMBER_ENV,
    commonConfig = {
      // Instructions: Add your custom shared config for packages and the boot app
      hinting: false,
      fingerprint: {
        // Disabling here since we do it at the end for *all* the assets
        enabled: false,
      }
    },
    bootAppConfig = {
      // Instructions: Add your custom config for the boot app here
    },
    bootApp, packagesApplications, bootAppTree, movedPackagesApplicationTrees;
  bootApp = new EmberAddon(defaults, commonConfig, bootAppConfig);

  // bootApp.import('only-import-dependencies-to-boot-NOT-to-packages');
  bootAppTree = bootApp.toTree();

  // packages subsequent calls to EmberApp() constructor must come after the main app.toTree
  // in order for the addons to run postprocessTree correctly
  packagesApplications = packageNames.map(function(packageName) {

    // packages export their own js file and are intended to distribute the code-base.
    var packageConfig = {
      // Instructions: Add your custom config for packages here
      name: packageName,
      // TODO: re-enable jshint once it's actually working fine, for now it just slows down the build
      // when running `ember test` it only jshints boot, but not this one. We'll rely on grunt for now
      tests: false,
      outputPaths: {
        app: {
          html: '',
          js: '/assets/' + packageName + '.js'
        }
      },
      trees: {
        app: mergeTrees([
          // The index.html is required, so we funnel it here.
          new Funnel('tests/dummy/packages/' + packageName)
        ]),
        styles: new Funnel('tests/dummy/packages/' + packageName + '/styles'),
        templates: new Funnel('tests/dummy/packages/' + packageName + '/templates')
      },
      vendorFiles: {
        // Avoids serving the same dependency twice. List extracted from ember-cli/lib/broccoli/ember-app.js#_initVendorFiles
        'jquery.js': null,
        'handlebars.js': null,
        'ember.js': null,
        'loader.js': null,

        // We need to leave this as is.
        // 'ember-testing.js': null,
        'app-shims.js': null,
        'ember-resolver.js': null,
        'ember-data': null, // do this for boot as well if you don't use ember-data
        'ember-cli-app-version': null,
        'vendor-suffix': null,
        'ember-load-initializers.js': null,
        'ember-debug-handlers-polyfill': null,
        'ember-cli-deprecation-workflow': null,
        'ic-ajax': null
      }
    },
    package = new EmberApp(defaults, commonConfig, packageConfig);

    // Prevent packages from creating their own Ember Application
    package.contentFor = function(config, match, type) {
      if (type === 'app-boot' || type === 'app-config') {
        return '';
      } else {
        return EmberApp.prototype.contentFor.call(this, config, match, type);
      }
    };
    package.index = function () {
      return new Funnel('tests/dummy/packages/' + packageName);
    };
    // Only boot includes addon's code
    package.addonTreesFor = function(type) {
      if (type === 'app') {
        return [];
      } else {
        return EmberApp.prototype.addonTreesFor.call(this, type);
      }
    };
    return package;
  });

  movedPackagesApplicationTrees = packagesApplications.map(function(package) {
    var packageTree = package.toTree();
    return new Funnel(packageTree);
  });

  var allTrees = mergeTrees(movedPackagesApplicationTrees.concat([bootAppTree/*, publicVendorFiles*/]), { overwrite: true });

  if (env === 'production') {
    allTrees = new AssetRev(allTrees);
  }

  return allTrees;
};
