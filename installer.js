#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const unCompress = require('all-unpacker');
const retryPromise = require('retrying-promise');
const node_wget = require('node-wget-fetch');

const _7zAppUrl = 'http://7-zip.org/a/';
const _7zipData = getDataForPlatform();
const whatToCopy = _7zipData.binaryFiles;
const cwd = process.cwd();

var versionCompare = function (left, right) {
  if (typeof left + typeof right != 'stringstring')
    return false;

  var a = left.split('.');
  var b = right.split('.');
  var i = 0;
  var len = Math.max(a.length, b.length);

  for (; i < len; i++) {
    if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
      return 1;
    } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
      return -1;
    }
  }

  return 0;
}

try {
  var appleOs = (process.platform == "darwin") ? require('macos-release').version : '';
} catch (e) {
  var appleOs = '';
}

const macOsVersion = (appleOs == '') ? appleOs :
  ((versionCompare(appleOs, '10.11.12') == 1) ? '10.15' : '10.11');

const zipExtraName = _7zipData.extraName;
const extraSource = path.join(cwd, zipExtraName);

const zipFilename = (process.platform != "darwin") ? _7zipData.filename :
  ((macOsVersion == '10.15') ? _7zipData.filename[1] : _7zipData.filename[0]);

const zipSfxModules = _7zipData.sfxModules;
const zipUrl = _7zipData.url;

const source = path.join(cwd, zipFilename);
const destination = path.join(cwd, process.platform);

const binaryDestination = path.join(__dirname, 'binaries', process.platform);
const _7zCommand = path.join(
  binaryDestination,
  process.platform == 'win32' ? '7za.exe' : '7za'
);

wget({
    url: _7zAppUrl + zipExtraName,
    dest: extraSource
  })
  .then(function () {
    if (zipUrl != null) {
      fs.mkdir(destination, (err) => {
        if (err) {}
      });
      platformUnpacker(source, destination)
        .then(function (mode) {
          if (!mode) {
            throw 'Unpacking for platform failed.';
          }
          whatToCopy.forEach(function (s) {
            try {
              fs.moveSync(
                path.join(
                  destination,
                  _7zipData.extractFolder,
                  _7zipData.appLocation,
                  s
                ),
                path.join(binaryDestination, s), {
                  overwrite: true
                }
              );
            } catch (err) {
              console.error(err);
            }
          });
          if (process.platform != 'win32') makeExecutable();
          console.log('Binaries copied successfully!');
          fs.unlink(source, (err) => {
            if (err) throw err;
          });
          fs.remove(destination, (err) => {
            if (err) throw err;
          });
          extraUnpack(
            _7zCommand,
            extraSource,
            binaryDestination,
            zipSfxModules
          );
          fs.unlink(extraSource, (err) => {
            if (err) throw err;
          });
          console.log('Sfx modules copied successfully!');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  })
  .catch(function (err) {
    console.error('Error downloading file: ' + err);
  });

function makeExecutable() {
  var chmod = ['7z', '7z.so', '7za', '7zCon.sfx', '7zr'];
  chmod.forEach(function (s) {
    try {
      fs.chmodSync(path.join(binaryDestination, s), 755);
    } catch (err) {
      console.error(err);
    }
  });
}

function getDataForPlatform() {
  switch (process.platform) {
    // Windows version
    case 'win32':
      return {
        url: 'http://d.7-zip.org/a/',
          filename: '7z1805-extra.7z',
          extraName: 'lzma1805.7z',
          extractFolder: '',
          appLocation: '',
          binaryFiles: ['Far', 'x64', '7za.dll', '7za.exe', '7zxa.dll'],
          sfxModules: ['7zr.exe', '7zS2.sfx', '7zS2con.sfx', '7zSD.sfx'],
      };
      // Linux version
    case 'linux':
      return {
        url:
          'https://iweb.dl.sourceforge.net/project/p7zip/p7zip/16.02/',
          filename: 'p7zip_16.02_x86_linux_bin.tar.bz2',
          extraName: 'lzma1604.7z',
          extractFolder: 'p7zip_16.02',
          appLocation: 'bin',
          binaryFiles: [
            '7z',
            '7z.so',
            '7za',
            '7zCon.sfx',
            '7zr',
            'Codecs',
          ],
          sfxModules: ['7zS2.sfx', '7zS2con.sfx', '7zSD.sfx'],
      };
      // Mac version
    case 'darwin':
      return {
        url:
          'https://raw.githubusercontent.com/rudix-mac/packages/master/',
          filename: ['p7zip-16.02-macos10.15.pkg', 'p7zip-16.02-macos10.11.pkg'],
          extraName: 'lzma1604.7z',
          extractFolder: '',
          appLocation: 'usr/local/lib/p7zip',
          binaryFiles: [
            '7z',
            '7z.so',
            '7za',
            '7zCon.sfx',
            '7zr',
            'Codecs',
          ],
          sfxModules: ['7zS2.sfx', '7zS2con.sfx', '7zSD.sfx'],
      };
  }
}

function wget(path) {
    console.log('Downloading ' + path.url);
    return new Promise(function (resolve, reject) {
        node_wget.wget(path.url, path.dest)
            .then((info) => resolve(info))
            .catch((err) => reject('Error downloading file: ' + err));
    });
}

function platformUnpacker(source, destination) {
  return new retryPromise({
    retries: 5
  }, function (resolve, retry) {
    wget({
      url: zipUrl + zipFilename,
      dest: source
    }).then(function () {
      if (process.platform == 'darwin') {
        console.log('Extracting: ' + zipFilename);
        unpack(source, destination)
          .then(function () {
            console.log('Decompressing: p7zipinstall.pkg/Payload');
            unpack(
              path.join(
                destination,
                'p7zipinstall.pkg',
                'Payload'
              ),
              destination
            ).then(function (data) {
              console.log('Decompressing: Payload');
              unpack(
                path.join(destination, 'Payload'),
                destination,
                _7zipData.appLocation + path.sep + '*'
              ).then(function () {
                return resolve('darwin');
              });
            });
          })
          .catch((err) => {
            retry(err);
          });
      } else if (process.platform == 'win32') {
        unpack(source, destination)
          .then(function () {
            return resolve('win32');
          })
          .catch((err) => {
            retry(err);
          });
      } else if (process.platform == 'linux') {
        unpack(source, destination)
          .then(function () {
            const system_installer = require('system-installer');
            const system = system_installer.packager();
            const toInstall =
              system.packager == 'yum' || system.packager == 'dnf' ?
              'glibc.i686' :
              'libc6-i386';
            system_installer.installer(toInstall).then(function () {
              return resolve('linux');
            });
          })
          .catch((err) => {
            retry();
          });
      }
    });
  }).catch((err) => {
    console.error(err);
  });
}

function unpack(source, destination, toCopy) {
  return new Promise(function (resolve, reject) {
    return unCompress.unpack(
      source, {
        files: toCopy == null ? '' : toCopy,
        targetDir: destination,
        forceOverwrite: true,
        noDirectory: true,
        quiet: true,
      },
      function (err, files, text) {
        if (err) return reject(err);
        return resolve(text);
      }
    );
  });
}

function extraUnpack(cmd, source, destination, toCopy) {
  var args = ['e', source, '-o' + destination];
  var extraArgs = args.concat(toCopy).concat(['-r', '-aos']);
  console.log('Running: ' + cmd + ' ' + extraArgs);
  var extraUnpacker = spawnSync(cmd, extraArgs);
  if (extraUnpacker.error) return extraUnpacker.error;
  else if (extraUnpacker.stdout.toString())
    return extraUnpacker.stdout.toString();
}

function spawnSync(spCmd, spArgs) {
  var doUnpack = spawn.sync(spCmd, spArgs, {
    stdio: 'pipe'
  });
  if (doUnpack.error) {
    console.error('Error 7za exited with code ' + doUnpack.error);
    console.log('resolve the problem and re-install using:');
    console.log('npm install');
    return doUnpack;
  } else return doUnpack;
}
