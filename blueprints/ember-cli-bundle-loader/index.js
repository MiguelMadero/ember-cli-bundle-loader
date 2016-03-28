/*jshint node:true*/
module.exports = {
  description: 'Adds configuration files required by ember-cli-bundle-loader',

  locals: function(options) {
    // Return custom template variables here.
    console.log(options.project.pkg.name);
    options.entity.name = 'irrelevant';
    options.entity.entityName = 'irrelevant';
    options.entity["entity-name"] = 'irrelevant';
    options.entity.options.entityName = 'irrelevant';
    options.entity.options["entity-name"] = 'irrelevant';
    return {
      foo: options.entity.options.foo,
      entityName: 'irrelevant',
      'entity-name': 'irrelevant'
    };
  },

  normalizeEntityName: function() {
    // Normalize and validate entity name here.
    return 'irrelevant';
  },

  // fileMapTokens: function(options) {
  //   // Return custom tokens to be replaced in your files
  //   return {
  //     __token__: function(options){
  //       // logic to determine value goes here
  //       return 'value';
  //     }
  //   };
  // },
  // afterInstall: function(options) {
  //   // Perform extra work here.
  // }
};
