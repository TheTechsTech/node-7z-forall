'use strict';
var nativeSeparator = require('path').sep;

/**
 * @param {string} path A path with the native directory separator.
 * @return {string} A path with / for directory separator.
 */
module.exports = function (path) {
    var result = path, next;
    while ((next = result.replace(nativeSeparator, '/')) !== result) {
        result = next;
    }
    return result;
};
