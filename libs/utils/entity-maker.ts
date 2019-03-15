import { consts } from '../../libs/constants/constants';

export function entityMaker(predicateURI, typeURI, instId, label) {
	const objectProp = {};
	objectProp[predicateURI] = {
		'@id': instId,
		'@type': typeURI,
		datatypeProperties: {},
		objectProperties: []
	};
	objectProp[predicateURI][consts.RDFS.label] = label;
	return objectProp;
};