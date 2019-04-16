import * as fs from 'graceful-fs';
import * as fj from 'formatter-json';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { FlatEntity } from '../models/flat-entity';

export function saveFile(fileName: string, storeName: string, context: string): void {
	// Normal JSON file.
    let file = fj(JSON.stringify(store[storeName]));
	file = file.replace(/\\n/g, ' ');
	fs.writeFileSync(`dist/json/${fileName}.json`, file);
	// JSON-LD file construction.
	const jsonLD: FlatEntity[] = [];
	// const jsonLD = {
	// 	'@context': context,
	// 	'@graph': []
	// };
	Object.keys(store[storeName]).forEach(key => {
		// Grab the basic @id, @type, and rdfs label
		const mainObj = {
			'@id': store[storeName][key]['@id'],
			'@type': store[storeName][key]['@type'],
			'http://www.w3.org/2000/01/rdf-schema#label': store[storeName][key][consts.RDFS.label]
		};
		// Pull datatype properties out of their singleton object and make them direct props.
		const dataProps = store[storeName][key].datatypeProperties;
		Object.keys(dataProps).forEach(key => {
			mainObj[key] = dataProps[key];
		});
		// Pull out object properties, and make them direct properties but with array groups for multiples.
		let objectProps = store[storeName][key].objectProperties;
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
	fs.writeFileSync(`dist/jsonld/${fileName}.schema.jsonld`, fileLD);
};
