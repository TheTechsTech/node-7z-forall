/*global describe, it */
'use strict';
var expect   = require('chai').expect;
var path = require('../../util/path');

describe('Utility: `path`', function () {

  it('should return default flags with no args', function (done) {
    var _7zcmd = path();
    expect(_7zcmd).to.be.an('object');
    done();
  });

});