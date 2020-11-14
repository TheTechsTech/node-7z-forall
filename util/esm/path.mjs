'use strict';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function (options) {
    // Create a string that can be parsed by `run`.
    let type = typeof options;
    if ((options) && (type == "object") && (options.hasOwnProperty('path'))) {
        return options.path;
    } else {
        let binaryPath = join(__dirname, '../..', "binaries", process.platform);
        let binaryFilename = (process.platform == "win32") ? '7za.exe' : '7za';
        return {
            path: binaryPath,
            filename: binaryFilename,
            filepath: join(binaryPath, binaryFilename)
        }
    }
};
