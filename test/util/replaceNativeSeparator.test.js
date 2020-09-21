/*global describe, it */
'use strict';
var expect = require('chai').expect;
var replaceNativeSeparator = require('../../util/replaceNativeSeparator');
var sep    = require('path').sep;

describe('Utility: `replaceNativeSeparator`', function () {

  it('should replace the native directory separator (' + sep + ')' +
    ' with / and allows / in input',
  function (done) {
    [
      ['abc',                                        'abc'],
      ['å/Ö',                                        'å/Ö'],
      ['3' + sep + 'π' + sep + '1' + sep + '4.txt',  '3/π/1/4.txt'],
      ['abc/def' + sep + 'g',                        'abc/def/g'],
      ['directory' + sep + 'file',                   'directory/file'],
      ['a' + sep + 'b' + sep + 'c' + sep + 'd.txt',  'a/b/c/d.txt'],
    ]
    .forEach(function (inputAndExpectedOutput) {
      var input = inputAndExpectedOutput[0];
      var expectedOutput = inputAndExpectedOutput[1];
      expect(replaceNativeSeparator(input)).to.eql(expectedOutput); 
    });
    done();
  });

});
