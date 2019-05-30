import * as fs from 'graceful-fs';

import { store } from '../constants/globalStore';

export function loadFile(fileName: string, storeName: string, isCountry?: boolean): void {
    let fileData: string;
    // If file exists, great. Otherwise make a blank one for later.
    try {
        fileData = fs.readFileSync(`dist/json/${fileName}.json`) as any as string;
    } catch (err) {
        fileData = '';
    }
    // If preexisting file data, use it.
    if (fileData) {
        const file = JSON.parse(fileData);
        store[storeName] = file;
    }
};
