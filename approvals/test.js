/*jshint node:true*/
/* global before, describe, it */
const approvals = require('approvals');
const config = require('./config');
const fs = require('fs');
const childProcess = require('child_process');

const basePath = 'tmp/approvals/';
approvals.configure(config);
approvals.mocha();

if (process.env['EMBER_TRY_SCENARIO'] && process.env['EMBER_TRY_SCENARIO'] !== 'default') {
  return;
}

before(function () {
  this.verifyFileContent = function (fileName) {
    this.verify(fs.readFileSync(fileName));
  };
});
describe('a dev build', function () {
  const outputPath = `${basePath}/dev-build/`;
  before(function() {
    this.timeout(30000);
    childProcess.execSync(`ember build --environment development  --output-path ${outputPath}`);
  });
  it('contains an index file', function () {
    this.verifyFileContent(`${outputPath}/index.html`);
  });

  var assetsToVerify = ['package1.js',
    'package1.css',
    'package2.js',
    'package2.css',
    'dummy.js',
    'dummy.css',
    'vendor.js',
    'vendor.css',];
  assetsToVerify.forEach(function (file) {
    it(`contains ${file}`, function () {
      this.verifyFileContent(`${outputPath}/assets/${file}`);
    });
  });
});

describe('a prd build', function () {
  const outputPath = `${basePath}/prd-build/`;
  before(function() {
    this.timeout(60000);
    childProcess.execSync(`ember build --environment production --output-path ${outputPath}`);
  });
  it('contains an index file with fingerprinted assets', function () {
    this.verifyFileContent(`${outputPath}/index.html`);
  });
});
