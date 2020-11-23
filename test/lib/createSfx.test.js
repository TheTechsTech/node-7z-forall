/*global describe, it */
'use strict';
const expect = require('chai').expect,
  fs = require('fs-extra'),
  createSfx = require('../../lib/createSfx');

describe('Method: `Zip.createSfx`', function () {

  it('should return successfully on an Windows Sfx build', function (done) {
    createSfx('test', ['*.js'], './test/')
      .then(function (data) {
        expect(data).to.exist;
        expect(fs.existsSync('./test/SfxPackages/test.exe')).to.be.eql(true);
        fs.removeSync('./test/SfxPackages');
        done();
      });
  });

  it('should return entries on progress and successfully', function (done) {
    createSfx('test', ['*.md'])
      .progress(function (entries) {
        expect(entries.length).to.be.at.least(1);
      })
      .then(function (data) {
        expect(data).to.exist;
        fs.removeSync(data);
        done();
      });
  });

  it('should return an error on 7z error', function (done) {
    createSfx('test.exe', '.tmp/test/nothere',
        '.tmp/test/', {
          '???': true
        })
      .catch(function (err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

});
