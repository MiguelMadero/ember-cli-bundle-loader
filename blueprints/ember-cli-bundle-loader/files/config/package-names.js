/*jshint node:true*/
var fs = require('fs'),
  path = require('path');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

var packagesDir = path.join(__dirname, '..', 'packages');
module.exports = getDirectories(packagesDir);
