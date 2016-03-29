/*jshint node:true*/
var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
  EmberAddon = require('ember-cli/lib/broccoli/ember-addon'),
  Funnel = require('broccoli-funnel'),
  mergeTrees = require('broccoli-merge-trees'),
  packageNames = require('../../tests/dummy/config/package-names'),
  AssetRev = require('broccoli-asset-rev'),
  merge = require('merge-defaults');

module.exports = EmberAppWithPackages;

function EmberAppWithPackages(defaults, options) {
  var sharedBuildConfig = {
      hinting: false,
      fingerprint: {
        // Disabling here since we do it at the end for *all* the assets
        enabled: false,
      }
    },
    appBuildConfig = {
      // Instructions: Add your custom config for the boot app here
    },
    packagesBuildConfig = {
      // Instructions: Add your custom config for packages here
      // TODO: re-enable jshint once it's actually working fine, for now it just slows down the build
      // when running `ember test` it only jshints boot, but not this one. We'll rely on grunt for now
      tests: false,
      outputPaths: {
        app: {
          html: '',
        }
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
    basePath = '';

  if (options) {
    basePath = options.basePath || '';
    sharedBuildConfig = merge(options.sharedBuildConfig || {}, sharedBuildConfig);
    appBuildConfig = merge(options.appBuildConfig || {}, appBuildConfig);
    packagesBuildConfig = merge(options.packagesBuildConfig || {}, packagesBuildConfig);
  }

  this.bootApp = new EmberAddon(defaults, sharedBuildConfig, appBuildConfig);

  // TODO: check if we need to call app.toTree before *creating* the apps or only before toTree'ing them
  // packages subsequent calls to EmberApp() constructor must come after the main app.toTree
  // in order for the addons to run postprocessTree correctly
  this.packagesApplications = packageNames.map(function(packageName) {

    // packages export their own js file and are intended to distribute the code-base.
    var packageConfig = {
      name: packageName,
      outputPaths: {
        app: {
          js: '/assets/' + packageName + '.js'
        }
      },
      trees: {
        app: mergeTrees([
          // The index.html is required, so we funnel it here.
          new Funnel(basePath + 'packages/' + packageName)
        ]),
        styles: new Funnel(basePath + 'packages/' + packageName + '/styles'),
        templates: new Funnel(basePath + 'packages/' + packageName + '/templates')
      }
    },
    package = new EmberApp(defaults, sharedBuildConfig, packagesBuildConfig, packageConfig);

    // Prevent packages from creating their own Ember Application
    package.contentFor = function(config, match, type) {
      if (type === 'app-boot' || type === 'app-config') {
        return '';
      } else {
        return EmberApp.prototype.contentFor.call(this, config, match, type);
      }
    };
    package.index = function () {
      return new Funnel(basePath + 'packages/' + packageName);
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
}

EmberAppWithPackages.prototype.import = function(asset, options) {
  this.bootApp.import(asset, options);
};

EmberAppWithPackages.prototype.toTree = function (additionalTrees) {
  var env = process.env.EMBER_ENV;
  var movedPackagesApplicationTrees = this.packagesApplications.map(function(package) {
    var packageTree = package.toTree();
    return new Funnel(packageTree);
  });
  var bootAppTree = this.bootApp.toTree();

  var allTrees = mergeTrees(movedPackagesApplicationTrees.concat([bootAppTree/*, publicVendorFiles*/]).concat(additionalTrees || []), {
    overwrite: true,
    annotation: 'TreeMerger (allTrees - App+Packages)'
  });

  if (env === 'production') {
    allTrees = new AssetRev(allTrees);
  }

  return allTrees;
};
