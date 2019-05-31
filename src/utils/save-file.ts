import * as fj from 'formatter-json';
import * as fs from 'graceful-fs';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';

export function saveFile(fileName: string, storeName: string, context: string): void {
	// Normal JSON file.
    let file = fj(JSON.stringify(store[storeName]));
	file = file.replace(/\\n/g, ' ');
	fs.writeFileSync(`dist/json/${fileName}.json`, file);
	// JSON-LD file construction.
	store.jsonLD = [];
	// const jsonLD = {
	// 	'@context': context,
	// 	'@graph': []
	// };
	Object.keys(store[storeName]).forEach(key1 => {
		// Grab the basic @id, @type, and rdfs label
		const mainObj = {
			'@id': store[storeName][key1]['@id'],
			'@type': store[storeName][key1]['@type'],
			'http://www.w3.org/2000/01/rdf-schema#label': store[storeName][key1][consts.RDFS.label]
		};
		// Pull datatype properties out of their singleton object and make them direct props.
		const dataProps = store[storeName][key1].datatypeProperties;
		Object.keys(dataProps).forEach(key2 => {
			mainObj[key2] = dataProps[key2];
		});
		// Pull out object properties, and make them direct properties but with array groups for multiples.
		const objectProps = store[storeName][key1].objectProperties;
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
		// store.jsonLD['@graph'].push(mainObj);
		store.jsonLD.push(mainObj);
		store[storeName][key1] = null;
	});

	store[storeName] = {};

    let fileLD = fj(JSON.stringify(store.jsonLD));
	fileLD = fileLD.replace(/\\n/g, ' ');
	fs.writeFileSync(`dist/jsonld/${fileName}.schema.jsonld`, fileLD);
	fileLD = null;
	store.debugLogger(`+++ Saved ${storeName} in ${fileName}.schema.jsonld`);
	store.debugLogger(`~~~ Converting jsonld to n-triples`);

	convertJsonldToNTriples();

	store.debugLogger(`~~~ Saving ${storeName} to ${fileName}.schema.nt`);
	fs.writeFileSync(`dist/n-triples/${fileName}.schema.nt`, store.jsonNT);
	store.jsonNT = '';
};

function convertJsonldToNTriples(): void {
	const length = store.jsonLD.length;
	for (let i = 0; i < length; i++) {
		const entity = store.jsonLD.pop();
		if (entity) {
			const mainId = entity['@id'];
			const mainLabel = entity['http://www.w3.org/2000/01/rdf-schema#label'];
			const mainType = entity['@type'];
			store.jsonNT += `<${mainId}> <http://www.w3.org/2000/01/rdf-schema#label> ${JSON.stringify(mainLabel)} .\n`;
			store.jsonNT += `<${mainId}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${mainType}> .\n`;
			Object.entries(entity).forEach(entry => {
				if (['@id', '@type', 'http://www.w3.org/2000/01/rdf-schema#label'].includes(entry[0])) {
					// Taken care of already.
				} else if (Array.isArray(entry[1])) {
					entry[1].forEach(innerEntry => {
						store.jsonNT += `<${mainId}> <${entry[0]}> <${innerEntry['@id']}> .\n`;
						store.jsonNT += `<${innerEntry['@id']}> <http://www.w3.org/2000/01/rdf-schema#label> ${JSON.stringify(innerEntry['http://www.w3.org/2000/01/rdf-schema#label'])} .\n`;
						store.jsonNT += `<${innerEntry['@id']}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${innerEntry['@type']}> .\n`;
					});
				} else if(entry[1] && typeof entry[1] === 'object') {
					store.jsonNT += `<${mainId}> <${entry[0]}> <${entry[1]['@id']}> .\n`;
					store.jsonNT += `<${entry[1]['@id']}> <http://www.w3.org/2000/01/rdf-schema#label> ${JSON.stringify(entry[1]['http://www.w3.org/2000/01/rdf-schema#label'])} .\n`;
					store.jsonNT += `<${entry[1]['@id']}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${entry[1]['@type']}> .\n`;
				} else {
					store.jsonNT += `<${mainId}> <${entry[0]}> ${JSON.stringify(entry[1])} .\n`;
				}
			});
		}
	}
};
