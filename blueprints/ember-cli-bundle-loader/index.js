/*jshint node:true*/
module.exports = {
  description: 'Adds configuration files required by ember-cli-bundle-loader',
  afterInstall: function () {
    var task = this.taskFor('addon-install');
    return task.run({
      verbose: true,
      packages: ['ember-get-config']
    });
  },
  normalizeEntityName: function() {
    // Normalize and validate entity name here.
    // The entitiy name isn't required, but ember-cli crashes without it
    return 'irrelevant';
  }
};
