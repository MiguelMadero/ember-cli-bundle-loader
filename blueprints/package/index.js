/*jshint node:true*/
var fs    = require('fs'),
  path  = require('path');

module.exports = {
  description: 'Generates a new package that can be bundled and lazy loaded',

  beforeInstall: function (options) {
    var packagesDir = path.join(options.target, 'packages');
    if (!fs.existsSync(packagesDir)) {
      console.log('Doesn\'t exist');
      fs.mkdirSync(path.join(options.target, 'packages'));
    }
  }
};
