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

  it('should return successfully on an Linux Sfx build', function (done) {
    createSfx('test', '*.js', './test/', {
          runProgram: 'doesnotstart.sh',
          directory: '/',
          installPath: '/home/',
          executeFile: 'notonLinux',
          executeParameters: '-d'
        },
        'console',
        'linux',
        '.elf')
      .then(function (data) {
        expect(data).to.exist;
        expect(fs.existsSync('./test/SfxPackages/test.elf')).to.be.eql(true);
        fs.removeSync('./test/SfxPackages');
        done();
      })
      .catch(function (err) {
        console.error('No error should be displayed!');
        console.error(err);
        expect(err).to.exist;
        done();
      });
  });

  it('should return successfully on an MacOS Sfx build', function (done) {
    createSfx('test', '*.js', './test/', {
          runProgram: 'doesnotstart.app',
          directory: '/',
          installPath: '/home/',
          executeFile: 'notonMac',
          executeParameters: '-d'
        },
        'console',
        'darwin',
        '.pkg')
      .then(function (data) {
        expect(data).to.exist;
        expect(fs.existsSync('./test/SfxPackages/test.pkg')).to.be.eql(true);
        fs.removeSync('./test/SfxPackages');
        done();
      })
      .catch(function (err) {
        console.error('No error should be displayed!');
        console.error(err);
        expect(err).to.exist;
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
