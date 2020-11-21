'use strict';
const when = require('when'),
  u = {
    replaceNativeSeparator: require('../util/replaceNativeSeparator'),
    run: require('../util/run'),
    switches: require('../util/switches')
  };

/**
 * Test integrity of archive.
 * @promise Test
 * @param archive {string} Path to the archive.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
module.exports = function (archive, options) {
  return when.promise(function (resolve, reject, progress) {

    // Create a string that can be parsed by `run`.
    let command = '7za t "' + archive + '"';

    // Start the command
    u.run(command, options)

      // When a stdout is emitted, parse each line and search for a pattern. When
      // the pattern is found, extract the file (or directory) name from it and
      // pass it to an array. Finally returns this array.
      .progress(function (data) {
        let entries = [];
        data.split('\n').forEach(function (line) {
          if (line.substr(0, 1) === 'T') {
            entries.push(u.replaceNativeSeparator(line.substr(2, line.length)));
          }
        });
        return progress(entries);
      })

      // When all is done resolve the Promise.
      .then(function (args) {
        return resolve(args);
      })

      // Catch the error and pass it to the reject function of the Promise.
      .catch(function (err) {
        return reject(err);
      });

  });
};
