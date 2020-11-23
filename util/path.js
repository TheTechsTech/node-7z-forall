'use strict';
const path = require("path");

module.exports = function (options, override = false) {
  // Create a string that can be parsed by `run`.
  let type = typeof options;
  if ((options) && (type == "object") && (options.hasOwnProperty('path'))) {
    return options.path;
  } else {
    let binaryPath = path.join(__dirname, "..", "binaries", (override == true ? process.platform + path.sep + 'other32' : process.platform));
    let binaryFilename = (process.platform == "win32") ? '7za.exe' : '7za';
    return {
      path: binaryPath,
      filename: binaryFilename,
      filepath: path.join(binaryPath, binaryFilename)
    }
  }
};
