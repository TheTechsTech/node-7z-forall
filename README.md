node-7z-forall
=======

[![NPM](https://nodei.co/npm/node-7z-forall.png)](https://nodei.co/npm/node-7z-forall/)

[![Dependencies Status][david-image]][david-url] [![Node.js CI](https://github.com/techno-express/node-7z-forall/workflows/Node.js%20CI/badge.svg)](https://github.com/techno-express/node-7z-forall) [![codecov](https://codecov.io/gh/techno-express/node-7z-forall/branch/master/graph/badge.svg?token=VoVpnT8B7X)](https://codecov.io/gh/techno-express/node-7z-forall) [![Maintainability][codeclimate-image]][codeclimate-url][![Release][npm-image]][npm-url]

> A Node.js wrapper for 7-Zip with binaries for **Linux**, **Windows**, and **Mac OSX**.

> ____This is for version 2.x WIP, for version 1.x see [1x](https://github.com/techno-express/node-7z-forall/tree/1x) branch.____

Usage
-----

This library use *Promises*, it's API is consistent with standard use:

```js
// CommonJS
const Zip = require('node-7z-forall');
const extractFull = Zip.extractFull;

// ESM for Node JS v12+
import { extractFull } from 'node-7z-forall';

extractFull('myArchive.7z', 'destination', { p: 'myPassword' } /* 7z options/switches */)
// Equivalent to `on('data', function (files) { // ... });`
.progress(function (files) {
  console.log('Some files are extracted: %s', files);
});

// When all is done
.then(function () {
  console.log('Extracting done!');
});

// On error
.catch(function (err) {
  console.error(err);
});
```

Installation
------------

This package will download the 7zip binaries at install time. Host system does not need to have 7zip installed or in PATH.

The binaries will be downloaded from:
> On Linux - https://sourceforge.net/projects/p7zip

> On Windows - https://www.7-zip.org/download.html

> On Mac OSX - https://rudix.org/

```bash
npm install --save node-7z-forall
```

API
---

> See the [7-Zip documentation](http://sevenzip.sourceforge.jp/chm/cmdline/index.htm)
> for the full list of usages and options (switches).

> The type of the list of files can be either *String* or *Array*.

**const Zip = require('node-7z-forall');**

*Or:*

**import Zip from 'node-7z-forall';**

*By method name:*
**import { add, delete, extract, extractFull, list, test, update } from 'node-7z-forall';**

### Add: `Zip.add`(archive, files, options)

**Arguments**
 * `archive` Path to the archive you want to create.
 * `files` The file list to add.
 * `options` An object of options (7-Zip switches).

**Progress**
 * `files` A array of all the added files. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.


### Delete: `Zip.delete`(archive, files, options)

**Arguments**
 * `archive` Path to the archive you want to delete files from.
 * `files` The file list to delete.
 * `options` An object of options (7-Zip switches).

**Error**
 * `err` An Error object.


### Extract: `Zip.extract`(archive, dest, options)

**Arguments**
 * `archive` The path to the archive you want to extract.
 * `dest` Where to extract the archive.
 * `options` An object of options.

**Progress**
 * `files` A array of all the extracted files *AND* directories. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.


### Extract with full paths: `Zip.extractFull`(archive, dest, options)

**Arguments**
 * `archive` The path to the archive you want to extract.
 * `dest` Where to extract the archive (creates folders for you).
 * `options` An object of options.

**Progress**
 * `files` A array of all the extracted files *AND* directories. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.


### List contents of archive: `Zip.list`(archive, options)

**Arguments**
 * `archive` The path to the archive you want to analyse.
 * `options` An object of options.

**Progress**
 * `files` A array of objects of all the extracted files *AND* directories.
   The `/` character is used as a path separator on every platform. Object's
   properties are: `date`, `attr`, `size` and `name`.

**Then - Resolved**
 * `spec` An object of tech spec about the archive. Properties are: `path`,
   `type`, `method`, `physicalSize` and `headersSize` (Some of them may be
   missing with non-7z archives).

**Error**
 * `err` An Error object.


### Test integrity of archive: `Zip.test`(archive, options)

**Arguments**
 * `archive` The path to the archive you want to analyse.
 * `options` An object of options.

**Progress**
 * `files` A array of all the tested files. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.


### Update: `Zip.update`(archive, files, options)

**Arguments**
 * `archive` Path to the archive you want to update.
 * `files` The file list to update.
 * `options` An object of options (7-Zip switches).

**Progress**
 * `files` A array of all the updated files. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.


Advanced usage
--------------

### Compression method

With the `7za` binary compression is made like that:

```bat
# adds *.exe and *.dll files to solid archive archive.7z using LZMA method
# with 2 MB dictionary and BCJ filter.
7za a archive.7z *.exe -m0=BCJ -m1=LZMA:d=21
```

With **node-7z-forall** you can translate it like that:

```js
import { add } from 'node-7z-forall';

add('archive.7z', '*.exe', {
  m0: '=BCJ',
  m1: '=LZMA:d=21'
})
.then(function () {
  // Do stuff...
});
```

### Add, delete and update multiple files

When adding, deleting or updating archives you can pass either a string or an
array as second parameter (the `files` parameter).

```js
import { delete as del } from 'node-7z-forall';

del('bigArchive.7z', [ 'file1', 'file2' ])
.then(function () {
  // Do stuff...
});
```

### Wildcards

You can extract with wildcards to specify one or more file extensions. To do
this add a `wildcards` attribute to the `options` object. The `wildcard`
attribute takes an *Array* as value. In this array each item is a wildcard.

```js
import { extractFull } from 'node-7z-forall';

extractFull('archive.zip', 'destination/', {
  wildcards: [ '*.txt', '*.md' ], // extract all text and Markdown files
  r: true // in each subfolder too
})
.progress(function (files) {
  // Do stuff with files...
})
.then(function () {
  // Do stuff...
});
```

Note that the `r` (for recursive) attribute is passed in this example.

### Raw inputs

> Thanks to sketchpunk #9 for this one

Sometimes you just want to use the lib as the original command line. For
instance you want to apply to switches with different values (e.g.:
`-i!*.jpg -i!*.png` to target only two types of extensions).

In such cases the default behavior of the `options` argument is not enough. You
can use the custom `raw` key in your `options` object and pass it an *Array* of
values.

```js
import { list } from 'node-7z-forall';

list('archive.zip', {
  raw: [ '-i!*.jpg', '-i!*.png' ], // only images
})
.progress(function (files) {
  // Do stuff with files...
})
.then(function () {
  // Do stuff...
});
```

***

[david-url]: https://david-dm.org/techno-express/node-7z-forall
[david-image]: http://img.shields.io/david/techno-express/node-7z-forall.svg
[codeclimate-url]: https://codeclimate.com/github/techno-express/node-7z-forall/maintainability
[codeclimate-image]: https://api.codeclimate.com/v1/badges/0d6a0bc69a8ea29c7de9/maintainability
[npm-url]: https://www.npmjs.org/package/node-7z-forall
[npm-image]: http://img.shields.io/npm/v/node-7z-forall.svg
