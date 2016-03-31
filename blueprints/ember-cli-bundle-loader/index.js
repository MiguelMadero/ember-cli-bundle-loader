/*jshint node:true*/
module.exports = {
  description: 'Adds configuration files required by ember-cli-bundle-loader',
  normalizeEntityName: function() {
    // Normalize and validate entity name here.
    // The entitiy name isn't required, but ember-cli crashes without it
    return 'irrelevant';
  }
};
