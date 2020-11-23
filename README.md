node-7z-forall
=======

[![NPM](https://nodei.co/npm/node-7z-forall.png)](https://nodei.co/npm/node-7z-forall/)

[![Dependencies Status][david-image]][david-url] [![Node.js CI](https://github.com/techno-express/node-7z-forall/workflows/Node.js%20CI/badge.svg)](https://github.com/techno-express/node-7z-forall) [![codecov](https://codecov.io/gh/techno-express/node-7z-forall/branch/master/graph/badge.svg?token=VoVpnT8B7X)](https://codecov.io/gh/techno-express/node-7z-forall) [![Maintainability][codeclimate-image]][codeclimate-url][![Release][npm-image]][npm-url]

> A CommonJs and ESM frontend to 7-Zip, downloads binaries in for **Linux**, **Windows**, and **Mac OSX**, with methods to create SFX self extracting 7z archives targeting different platforms.

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

__How to create Sfx - Self Extracting Archives.__

Executables will be built using 7-zip version _19.00_ on **Windows OS** for Windows targets.
**Linux** and **Apple macOS** will use 7-zip version _16.04_ for all targets.

- **createSfxWindows**(name, files, destination, options, type);

- **createSfxLinux**(name, files, destination, options, type);

- **createSfxMac**(name, files, destination, options, type);

Each will inturn call **createSfx**(name, files, destination, options, type, platform, extension) as follows:

```js
/**
 * Creates self extracting archive, an Installation Package.
 *
 * @param {String} name Application name.
 * @param {Array} files Files to add.
 * @param {String} destination Application root for the `SfxPackages` directory, will default to package root.
 * - All Sfx package archives are stored in the **created** `SfxPackages` directory.
 * - The `destination` directory must already exists.
 * @param {Object} options Object for Installer config and 7-zip switch options.
 *
 * `{`
 *
 * `title:` - Window title message, Default "`name` installation package created on `Current running platform OS`"
 *
 * `beginPrompt:` - Begin Prompt message, Default "Do you want to install `name`?""
 *
 * `installPath:` - "path_to_extract", Sets the extraction path. The extraction folder will not be deleted after the extraction.
 *
 * `progress:` - Value can be "yes" or "no". Default value is "yes".
 *
 * `runProgram:` - Command for executing. Default value is "setup.exe".
 * Substring `% % T` will be replaced with path to temporary folder,
 * where files were extracted
 *
 * `directory:` - Directory prefix for `RunProgram`. Default value is `.\`
 *
 * `executeFile:` Name of file for executing
 *
 * `executeParameters:` Parameters for `ExecuteFile`
 *
 * `}`
 *
 * `NOTE:` There are two ways to run program: `RunProgram` and `ExecuteFile`.
 * - Use `RunProgram`, if you want to run some program from .7z archive.
 * - Use `ExecuteFile`, if you want to open some document from .7z archive or
 * if you want to execute some command from Windows.
 * @param {String} type Application type `gui` or `console`. Default `gui`. Only `console` possible on **Linux** and **Mac** OS.
 * @param {String} platform What platform application targeting? Either `win32`, `darwin`, or `linux`.
 * @param {String} extension Binary extension name.
 *
 * @resolve {String} The created application full path location.
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
createSfx(
  name,
  files,
  destination = {PACKAGE_ROOT} + '/SfxPackages',
  options = {
      title: 'Windows Title',
      beginPrompt: 'Begin installation?',
      progress: 'no',
      runProgram: 'start',
      directory: './',
    ....
  },
  type = 'gui',
  platform = 'win32',
  extension = '.exe'
);
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

> See the [7-Zip documentation](http://sevenzip.sourceforge.jp/chm/cmdline/index.htm) Or [7 Zip Command Line Examples](https://www.dotnetperls.com/7-zip-examples)
> for the full list of usages and options (**switches**).

> The type of the list of files can be either *String* or *Array*.

**const Zip = require('node-7z-forall');**

*Or:*

**import Zip from 'node-7z-forall';**

*By method name:*
**import { add, delete, extract, extractFull, list, test, update } from 'node-7z-forall';**

_____Options:_____ 7-Zip Switches, use without initial `'-'`.

```md
  -- : Stop switches and @listfile parsing
  -ai[r[-|0]]{@listfile|!wildcard} : Include archives
  -ax[r[-|0]]{@listfile|!wildcard} : eXclude archives
  -ao{a|s|t|u} : set Overwrite mode
  -an : disable archive_name field
  -bb[0-3] : set output log level
  -bd : disable progress indicator
  -bs{o|e|p}{0|1|2} : set output stream for output/error/progress line
  -bt : show execution time statistics
  -i[r[-|0]]{@listfile|!wildcard} : Include filenames
  -m{Parameters} : set compression Method
    -mmt[N] : set number of CPU threads
    -mx[N] : set compression level: -mx1 (fastest) ... -mx9 (ultra)
  -o{Directory} : set Output directory
  -p{Password} : set Password
  -r[-|0] : Recurse subdirectories
  -sa{a|e|s} : set Archive name mode
  -scc{UTF-8|WIN|DOS} : set charset for console input/output
  -scs{UTF-8|UTF-16LE|UTF-16BE|WIN|DOS|{id}} : set charset for list files
  -scrc[CRC32|CRC64|SHA1|SHA256|*] : set hash function for x, e, h commands
  -sdel : delete files after compression
  -seml[.] : send archive by email
  -sfx[{name}] : Create SFX archive
  -si[{name}] : read data from stdin
  -slp : set Large Pages mode
  -slt : show technical information for l (List) command
  -snh : store hard links as links
  -snl : store symbolic links as links
  -sni : store NT security information
  -sns[-] : store NTFS alternate streams
  -so : write data to stdout
  -spd : disable wildcard matching for file names
  -spe : eliminate duplication of root folder for extract command
  -spf : use fully qualified file paths
  -ssc[-] : set sensitive case mode
  -sse : stop archive creating, if it can't open some input file
  -ssw : compress shared files
  -stl : set archive timestamp from the most recently modified file
  -stm{HexMask} : set CPU thread affinity mask (hexadecimal number)
  -stx{Type} : exclude archive type
  -t{Type} : Set type of archive
  -u[-][p#][q#][r#][x#][y#][z#][!newArchiveName] : Update options
  -v{Size}[b|k|m|g] : Create volumes
  -w[{path}] : assign Work directory. Empty path means a temporary directory
  -x[r[-|0]]{@listfile|!wildcard} : eXclude filenames
  -y : assume Yes on all queries
```

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
