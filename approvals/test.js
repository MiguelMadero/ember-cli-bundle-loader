/*jshint node:true*/
/* global before, describe, it */
const approvals = require('approvals');
const config = require('./config');
const fs = require('fs');
const childProcess = require('child_process');
const cheerio = require('cheerio');
const assert = require('assert');

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
    const html = fs.readFileSync(`${outputPath}/index.html`, 'utf8');
    console.log(html);
    const $ = cheerio.load(html);
    const scripts = $('script');
    console.log(scripts);
    assert.equal(2, scripts.length, 'Should contain 2 script tags');
    assert.ok(/assets\/vendor-.*\.js/.exec($(scripts[0]).attr('src')));
    assert.ok(/assets\/dummy-.*\.js/.exec($(scripts[1]).attr('src')));

    const styles = $('link');
    assert.equal(2, styles.length, 'Should contain 2 link tags');
    assert.ok(/assets\/vendor-.*\.css/.exec($(styles[0]).attr('href')));
    assert.ok(/assets\/dummy-.*\.css/.exec($(styles[1]).attr('href')));
  });
});
