'use strict';
var path = require("path");

module.exports = function (options) {
    // Create a string that can be parsed by `run`.
    var type = typeof options;
    if ((options) && (type == "object") && (options.hasOwnProperty('path'))) return options.path;
    else {
        var binaryPath = path.join(__dirname, "..", "binaries", process.platform);
        var binaryFilename = (process.platform == "win32") ? '7za.exe' : '7za';
        return {
            path: binaryPath,
            filename: binaryFilename,
            fullpath: path.join(binaryPath, binaryFilename)
        }
    }
};