/*global describe, it */
'use strict';
import chai from 'chai';
import add from '../../lib/esm/add.mjs';

describe('ESM Method: `Zip.add`', function () {

    it('should return an error on 7z error', function (done) {
        add('.tmp/test/addnot.7z', '.tmp/test/nothere', { '???': true })
            .catch(function (err) {
                chai.expect(err).to.be.an.instanceof(Error);
                done();
            });
    });

    it('should return entries on progress', function (done) {
        add('.tmp/test/add.zip', '*.md')
            .progress(function (entries) {
                chai.expect(entries.length).to.be.at.least(1);
                done();
            });
    });

    it('should accept array as source', function (done) {
        let store = [];
        add('.tmp/test/add.zip', ['*.md', '*.js'])
            .progress(function (entries) {
                entries.forEach(function (e) {
                    store.push(e);
                });
            })
            .done(function () {
                chai.expect(store.length).to.be.at.least(4);
                done();
            });
    });

});
