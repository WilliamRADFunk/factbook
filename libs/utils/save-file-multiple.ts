import * as fs from 'graceful-fs';
import * as fj from 'formatter-json';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';

export function saveFileMultiple(fileName: string, storeName: string, context: string) {
	const entries = Object.entries(store[storeName]);
	store[storeName] = {};
	for (let fileCounter = 0; (fileCounter * 20) < entries.length && (fileCounter * 20) < 1000; fileCounter++) {
		const fileCounterFormatted = (fileCounter / 1000).toFixed(3).split('.')[1];
		// Normal JSON file.
		let file = fj(JSON.stringify(store[storeName]));
		file = file.replace(/\\n/g, ' ');
		fs.writeFileSync(`dist/json/${fileName}-${fileCounterFormatted}.json`, file);
		// JSON-LD file construction.
		const jsonLD = [];
		// const jsonLD = {
		// 	'@context': context,
		// 	'@graph': []
		// };
		entries.slice(fileCounter * 20, fileCounter * 20 + 20).forEach(entry => {
			// Grab the basic @id, @type, and rdfs label
			const mainObj = {
				'@id': entry[1]['@id'],
				'@type': entry[1]['@type']
			};
			mainObj[consts.RDFS.label] = entry[1][consts.RDFS.label];
			// Pull datatype properties out of their singleton object and make them direct props.
			const dataProps = entry[1]['datatypeProperties'];
			Object.keys(dataProps).forEach(key => {
				mainObj[key] = dataProps[key];
			});
			// Pull out object properties, and make them direct properties but with array groups for multiples.
			const objectProps = entry[1]['objectProperties'];
			objectProps.forEach(objP => {
				// Should be one key per object
				const key = Object.keys(objP)[0];
				if (mainObj[key]) {
					if (Array.isArray(mainObj[key])) {
						mainObj[key].push(objP[key]);
					} else {
						mainObj[key] = [mainObj[key], objP[key]];
					}
				} else {
					mainObj[key] = objP[key];
				}
			})
			// Add it to the graph that belongs to this entity type.
			// jsonLD['@graph'].push(mainObj);
			jsonLD.push(mainObj);
		});

		let fileLD = fj(JSON.stringify(jsonLD));
		fileLD = fileLD.replace(/\\n/g, ' ');
		fs.writeFileSync(`dist/jsonld/${fileName}-${fileCounterFormatted}.jsonld`, fileLD);
	}
};
