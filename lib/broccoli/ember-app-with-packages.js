/*jshint node:true*/
var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
  EmberAddon = require('ember-cli/lib/broccoli/ember-addon'),
  Funnel = require('broccoli-funnel'),
  mergeTrees = require('broccoli-merge-trees'),
  AssetRev = require('broccoli-asset-rev'),
  merge = require('merge-defaults'),
  getBundleConfiguration = require('../utils/get-bundle-configuration');

module.exports = EmberAppWithPackages;

function EmberAppWithPackages(defaults, options) {
  var isAddon = !!defaults.project.pkg["ember-addon"],
    sharedBuildConfig = {
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
    basePath = isAddon ? 'tests/dummy/' : '',
    bundles = [],
    packageNames = [];

  if (options) {
    sharedBuildConfig = merge(options.sharedBuildConfig || {}, sharedBuildConfig);
    appBuildConfig = merge(options.appBuildConfig || {}, appBuildConfig);
    packagesBuildConfig = merge(options.packagesBuildConfig || {}, packagesBuildConfig);
  }
  packageNames = require(defaults.project.root + '/' + basePath + '/config/package-names');
  bundles = require(defaults.project.root + '/' + basePath + '/config/bundles');
  bundles = getBundleConfiguration(bundles, packageNames);

  if (isAddon) {
    // We're inside an addon, so use an Addon constructor for the main app to get the right paths to tests/dummy/index and other likely other places
    this.bootApp = new EmberAddon(defaults, sharedBuildConfig, appBuildConfig);
  } else {
    this.bootApp = new EmberApp(defaults, sharedBuildConfig, appBuildConfig);
  }

  this.bootApp.contentFor = function(config, match, type) {
    var content = [];
    if (type === 'app-boot') {
      content.push('define(\'ember-cli-bundle-loader/config/bundles\', function() { ');
      content.push('  return ' + JSON.stringify(bundles));
      content.push('});');

      content.push('define(\'ember-cli-bundle-loader/config/package-names\', function() { ');
      content.push('  return ' + JSON.stringify(packageNames));
      content.push('});');

      content = content.concat(
        EmberApp.prototype.contentFor.call(this, config, match, type));
      return content.join('\n');
    } else {
      return EmberApp.prototype.contentFor.call(this, config, match, type);
    }
  };

  // TODO: check if we need to call app.toTree before *creating* the apps or only before toTree'ing them
  // packages subsequent calls to EmberApp() constructor must come after the main app.toTree
  // in order for the addons to run postprocessTree correctly
  this.packagesApplications = packageNames.map(function(packageName) {
    // packages export their own js file and are intended to distribute the code-base.
    var packageConfig = {
      name: packageName,
      outputPaths: {
        app: {
          js: '/assets/' + packageName + '.js',
          css: {
            app: '/assets/' + packageName + '.css'
          }
        },
      },
      trees: {
        app: mergeTrees([
          // The index.html is required, so we funnel it here, but return it unmodified
          // below (see package.index) to avoid running ConfigReplace
          new Funnel(basePath + 'app', { files: ['index.html'] }),
          new Funnel(basePath + 'packages/' + packageName)
        ]),
        styles: new Funnel(basePath + 'packages/' + packageName + '/styles'),
        templates: new Funnel(basePath + 'packages/' + packageName + '/templates')
      }
    },
    // Adds a last parameter with an empty object to avoid mutating packagesBuildConfig since it's shared by all packages.
    package = new EmberApp(defaults, packageConfig, sharedBuildConfig, packagesBuildConfig, {});

    // Prevent packages from creating their own Ember Application
    package.contentFor = function(config, match, type) {
      if (type === 'app-boot' || type === 'app-config') {
        return '';
      } else {
        return EmberApp.prototype.contentFor.call(this, config, match, type);
      }
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
