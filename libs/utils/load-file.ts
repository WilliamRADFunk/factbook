import * as fs from 'graceful-fs';

import { store } from '../constants/globalStore';

export function loadFile(fileName: string, storeName: string, isCountry?: boolean) {
    let fileData;
    // If file exists, great. Otherwise make a blank one for later.
    try {
        fileData = fs.readFileSync(`dist/json/${fileName}.json`);
    } catch (err) {
        fs.closeSync(fs.openSync(`dist/json/${fileName}.json`, 'w'));
    }
    // If preexisting file data, use it.
    if (fileData) {
        const file = JSON.parse(fileData);
        store[storeName] = file[storeName];
        if (isCountry) {
            store.countriesInList = file.countriesInList;
        }
    }
};
