import * as fs from 'graceful-fs';

import { store } from '../constants/globalStore';

export function saveFile(fileName: string, storeName: string) {
    let file = JSON.stringify(store[storeName]);
	file = file.replace(/\\n/g, ' ');
	fs.writeFileSync(`dist/${fileName}.json`, file);
};
