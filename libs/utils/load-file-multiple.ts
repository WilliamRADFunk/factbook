import * as fs from 'graceful-fs';

import { store } from '../constants/globalStore';

export function loadFileMultiple(fileName: string, storeName: string) {
	let fileCounter = -1;
	while (true && fileCounter >= 1000) {
		const fileCounterFormatted = (fileCounter / 1000).toFixed(3).split('.')[1];
		let fileData;
		// If file exists, great. Otherwise make a blank one for later.
		try {
			fileData = fs.readFileSync(`dist/json/${fileName}-${fileCounterFormatted}.json`);
		} catch (err) {
			// fs.closeSync(fs.openSync(`dist/json/${fileName}.json`, 'w'));
			break;
		}
		// If preexisting file data, use it.
		if (fileData) {
			const file = JSON.parse(fileData);
			Object.entries(file).forEach(entry => {
				store[storeName][entry[0]] = entry[1];
			});
		}
	}
};
