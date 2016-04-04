/*jshint node:true*/
var reporters = [
  "BeyondCompare",
  "opendiff",
  "p4merge",
  "tortoisemerge",
  "gitdiff"
];

if (process.env.CI) {
  reporters = ['gitdiff'];
}

module.exports = {reporters};
