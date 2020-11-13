'use strict';

import _Add from './add.mjs';
import _Delete from './delete.mjs';
import _Extract from './extract.mjs';
import _ExtractFull from './extractFull.mjs';
import _List from './list.mjs';
import _Test from './test.mjs';
import _Update from './update.mjs';
import _Binary from '../../util/esm/path.mjs';

class Zip {
    constructor() { }
}

Zip.add = _Add;
Zip.delete = _Delete;
Zip.extract = _Extract;
Zip.extractFull = _ExtractFull;
Zip.list = _List;
Zip.test = _Test;
Zip.update = _Update;
Zip.binary = _Binary;

export default Zip;
export const add = _Add;
export { _Delete as delete };
export const extract = _Extract;
export const extractFull = _ExtractFull;
export const list = _List;
export const test = _Test;
export const update = _Update;
export const binary = _Binary;
