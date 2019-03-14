import * as fs from 'graceful-fs';
import * as fj from 'formatter-json';

import { store } from '../constants/globalStore';

export function saveFile(fileName: string, storeName: string) {
    let file = fj(JSON.stringify(store[storeName]));
	file = file.replace(/\\n/g, ' ');
	fs.writeFileSync(`dist/${fileName}.json`, file);
};
