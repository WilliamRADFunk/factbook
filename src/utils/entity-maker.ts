import { EntityContainer } from '../models/entity-container';

export function entityMaker(predicateURI: string, typeURI: string, instId: string, label: string): EntityContainer {
	const objectProp: EntityContainer = {};
	objectProp[predicateURI] = {
		'@id': instId,
		'@type': typeURI,
		'http://www.w3.org/2000/01/rdf-schema#label': '',
		datatypeProperties: {},
		objectProperties: []
	};
	objectProp[predicateURI]['http://www.w3.org/2000/01/rdf-schema#label'] = label;
	return objectProp;
};