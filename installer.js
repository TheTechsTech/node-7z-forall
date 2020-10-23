#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const uncompress = require('all-unpacker');
const retryPromise = require('retrying-promise');
const node_wget = require('wget-improved');

const _7zAppurl = 'http://7-zip.org/a/';
const _7zipData = getDataForPlatform();
const whattocopy = _7zipData.binaryfiles;
const cwd = process.cwd();

const zipextraname = _7zipData.extraname;
const extrasource = path.join(cwd, zipextraname);
const zipfilename = _7zipData.filename;
const zipsfxmodules = _7zipData.sfxmodules;
const zipurl = _7zipData.url;

const source = path.join(cwd, zipfilename);
const destination = path.join(cwd, process.platform);

const binarydestination = path.join(__dirname, 'binaries', process.platform);
const _7zcommand = path.join(
    binarydestination,
    process.platform == 'win32' ? '7za.exe' : '7za'
);

wget({ url: _7zAppurl + zipextraname, dest: extrasource })
    .then(function () {
        if (zipurl != null) {
            fs.mkdir(destination, (err) => {
                if (err) {
                }
            });
            platformUnpacker(source, destination)
                .then(function (mode) {
                    if (!mode) {
                        throw 'Unpacking for platform failed.';
                    }
                    whattocopy.forEach(function (s) {
                        try {
                            fs.moveSync(
                                path.join(
                                    destination,
                                    _7zipData.extractfolder,
                                    _7zipData.applocation,
                                    s
                                ),
                                path.join(binarydestination, s),
                                { overwrite: true }
                            );
                        } catch (err) {
                            console.error(err);
                        }
                    });
                    if (process.platform != 'win32') makeexecutable();
                    console.log('Binaries copied successfully!');
                    fs.unlink(source, (err) => {
                        if (err) throw err;
                    });
                    fs.remove(destination, (err) => {
                        if (err) throw err;
                    });
                    extraunpack(
                        _7zcommand,
                        extrasource,
                        binarydestination,
                        zipsfxmodules
                    );
                    fs.unlink(extrasource, (err) => {
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

function makeexecutable() {
    var chmod = ['7z', '7z.so', '7za', '7zCon.sfx', '7zr'];
    chmod.forEach(function (s) {
        try {
            fs.chmodSync(path.join(binarydestination, s), 755);
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
                extraname: 'lzma1805.7z',
                extractfolder: '',
                applocation: '',
                binaryfiles: ['Far', 'x64', '7za.dll', '7za.exe', '7zxa.dll'],
                sfxmodules: ['7zr.exe', '7zS2.sfx', '7zS2con.sfx', '7zSD.sfx'],
            };
        // Linux version
        case 'linux':
            return {
                url:
                    'https://iweb.dl.sourceforge.net/project/p7zip/p7zip/16.02/',
                filename: 'p7zip_16.02_x86_linux_bin.tar.bz2',
                extraname: 'lzma1604.7z',
                extractfolder: 'p7zip_16.02',
                applocation: 'bin',
                binaryfiles: [
                    '7z',
                    '7z.so',
                    '7za',
                    '7zCon.sfx',
                    '7zr',
                    'Codecs',
                ],
                sfxmodules: ['7zS2.sfx', '7zS2con.sfx', '7zSD.sfx'],
            };
        // Mac version
        case 'darwin':
            return {
                url:
                    'https://raw.githubusercontent.com/rudix-mac/packages/master/',
                filename: 'p7zip-16.02-macos10.15.pkg',
                extraname: 'lzma1604.7z',
                extractfolder: '',
                applocation: 'usr/local/lib/p7zip',
                binaryfiles: [
                    '7z',
                    '7z.so',
                    '7za',
                    '7zCon.sfx',
                    '7zr',
                    'Codecs',
                ],
                sfxmodules: ['7zS2.sfx', '7zS2con.sfx', '7zSD.sfx'],
            };
    }
}

function wget(path) {
    console.log('Downloading ' + path.url);
    return new Promise(function (resolve, reject) {
        let download = node_wget.download(path.url, path.dest, {});
        download.on('error', function(err) {
            console.error('Error downloading file: ' + err);
        });
        download.on('end', function(output) {
            return resolve();
        });
    });
}

function platformUnpacker(source, destination) {
    return new retryPromise({ retries: 5 }, function (resolve, retry) {
        wget({ url: zipurl + zipfilename, dest: source }).then(function () {
            if (process.platform == 'darwin') {
                console.log('Extracting: ' + zipfilename);
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
                                _7zipData.applocation + path.sep + '*'
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
                        const distro = system_installer.packager();
                        const toinstall =
                            distro.packager == 'yum' || distro.packager == 'dnf'
                                ? 'glibc.i686'
                                : 'libc6-i386';
                        system_installer.installer(toinstall).then(function () {
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

function unpack(source, destination, tocopy) {
    return new Promise(function (resolve, reject) {
        return uncompress.unpack(
            source,
            {
                files: tocopy == null ? '' : tocopy,
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

function extraunpack(cmd, source, destination, tocopy) {
    var args = ['e', source, '-o' + destination];
    var extraargs = args.concat(tocopy).concat(['-r', '-aos']);
    console.log('Running: ' + cmd + ' ' + extraargs);
    var extraunpacker = spawnsync(cmd, extraargs);
    if (extraunpacker.error) return extraunpacker.error;
    else if (extraunpacker.stdout.toString())
        return extraunpacker.stdout.toString();
}

function spawnsync(spcmd, spargs) {
    var dounpack = spawn.sync(spcmd, spargs, { stdio: 'pipe' });
    if (dounpack.error) {
        console.error('Error 7za exited with code ' + dounpack.error);
        console.log('resolve the problem and re-install using:');
        console.log('npm install');
        return dounpack;
    } else return dounpack;
}
