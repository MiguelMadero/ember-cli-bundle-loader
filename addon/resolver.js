import Ember from 'ember';
import EmberResolver from 'ember-resolver';
import config from './config/environment';

var lookupFunctions = [],
  genericModuleNameLookupPatterns = [
    // NOTE: the order is important, since they're evaluted as we add them to the array
    // So we need the podBasedModuleName first and defaultModuleName last, just like the ember-resolver does

    // NOTE: temporarily removes podBasedModuleName lookups to reduce noise when using LOG_REOSLVER
    // function podBasedModuleName(packageName, parsedName) {
    //     // var podPrefix = this.namespace.podModulePrefix || this.namespace.modulePrefix;
    //     var podPrefix = packageName;

    //     return this.podBasedLookupWithPrefix(podPrefix, parsedName);
    // },

    // NOTE: temporarily removes podBasedModuleName lookups to reduce noise when using LOG_REOSLVER
    // function podBasedComponentsInSubdir(packageName, parsedName) {
    //     // var podPrefix = this.namespace.podModulePrefix || this.namespace.modulePrefix;
    //     var podPrefix = packageName;
    //     podPrefix = podPrefix + '/components';

    //     if (parsedName.type === 'component' || parsedName.fullNameWithoutType.match(/^components/)) {
    //         return this.podBasedLookupWithPrefix(podPrefix, parsedName);
    //     }
    // },

    function mainModuleName(packageName, parsedName) {
      // if router:main or adapter:main look for a module with just the type first
      var tmpModuleName = /*parsedName.prefix + '/' +*/ packageName + '/' + parsedName.type;

      if (parsedName.fullNameWithoutType === 'main') {
        return tmpModuleName;
      }
    },
    // Extensions the ember-resolver lookuppatterns that take a 'packageName'
    function defaultModuleName(packageName, parsedName) {
      return packageName + '/' + this.pluralize(parsedName.type) + '/' + parsedName.fullNameWithoutType;
    }
  ];

// The order is again important
genericModuleNameLookupPatterns.forEach(function(genericLookupPattern) {
  config.packageNames.concat(config.modulePrefix).forEach(function(packageName) {
    lookupFunctions.push(function(parsedName) {
      return genericLookupPattern.call(this, packageName, parsedName);
    });
  });
});

export default EmberResolver.extend({
  moduleNameLookupPatterns: Ember.computed(function() {
    // Not sure if we need to delegate, this might be enough.
    // return lookupFunctions.concat(this._super());
    return lookupFunctions;
  })
});
