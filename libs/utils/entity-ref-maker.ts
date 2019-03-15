import { consts } from '../../libs/constants/constants';

export function entityRefMaker(predicateURI, entity) {
	const objectProp = {};
	objectProp[predicateURI] = {
		'@id': entity[predicateURI]['@id'],
		'@type': entity[predicateURI]['@type']
	};
	objectProp[predicateURI][consts.RDFS.label] = entity[predicateURI][consts.RDFS.label];
	return objectProp;
};