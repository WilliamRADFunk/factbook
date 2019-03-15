import * as fs from 'graceful-fs';
import * as fj from 'formatter-json';

import { store } from '../constants/globalStore';

const context = {
	'asset': 'http://www.daedafusion.com/Asset#',
	'dbpCountry': 'http://dbpedia.org/ontology/Country#',
	'dc': 'http://purl.org/dc/elements/1.1/',
	'owl': 'http://www.w3.org/2002/07/owl#',
	'pos': 'http://www.w3.org/2003/01/geo/wgs84_pos#',
	'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
	'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
	'wfact': 'http://williamrobertfunk.com/ontologies/world-factbook#',
	'xsd': 'http://www.w3.org/2001/XMLSchema#'
};

export function saveFile(fileName: string, storeName: string) {
	const jsonLD = {
		'@context': context,
		'@graph': []
	};
	Object.keys(store[storeName]).forEach(key => {
		jsonLD['@graph'].push(store[storeName][key]);
	});

    let file = fj(JSON.stringify(jsonLD));
	file = file.replace(/\\n/g, ' ');
	fs.writeFileSync(`dist/${fileName}.json`, file);
};
