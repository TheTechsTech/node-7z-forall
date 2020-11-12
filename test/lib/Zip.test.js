/*global describe, it */
'use strict';
const expect = require('chai').expect,
    Zip = require('../../lib');

describe('Class: `Zip`', function () {

    it('should be a class', function () {
        const zip = new Zip();
        expect(zip).to.be.an.instanceof(Zip);
    });

    it('should respond to 7-Zip commands as methods', function () {
        expect(Zip).itself.to.respondTo('add');
        expect(Zip).itself.to.respondTo('delete');
        expect(Zip).itself.to.respondTo('extract');
        expect(Zip).itself.to.respondTo('extractFull');
        expect(Zip).itself.to.respondTo('list');
        expect(Zip).itself.to.respondTo('test');
        expect(Zip).itself.to.respondTo('update');
    });

});
