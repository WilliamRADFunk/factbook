import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getMaritimeClaims(cheerioElem, country, countryId) {
	let objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.CUSTOM.HAS_MARITIME_CLAIM);
	var mcId = consts.CUSTOM.INST_MARITIME_CLAIM + getUuid(country);
	var objectProp = {};
	if (!map) {
		if (store.maritimeClaims[mcId]) {
			objectProp[consts.CUSTOM.HAS_MARITIME_CLAIM] = store.maritimeClaims[mcId];
		} else {
			objectProp = entityMaker(
				consts.CUSTOM.HAS_MARITIME_CLAIM,
				consts.CUSTOM.ONT_MARITIME_CLAIM,
				mcId,
				`Maritime Claim for ${country}`);
			store.maritimeClaims[mcId] = objectProp[consts.CUSTOM.HAS_MARITIME_CLAIM];
		}
		map = objectProp[consts.CUSTOM.HAS_MARITIME_CLAIM];
		store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_MARITIME_CLAIM, objectProp));
	}
  cheerioElem('#field-maritime-claims > div.category_data.subfield.numeric').each(function() {
		let seaSwitch = cheerioElem(this).find('span.subfield-name').text().trim();
		let seaData = cheerioElem(this).find('span.subfield-number').text().trim();
		switch (seaSwitch) {
			case 'territorial sea:':
				map.datatypeProperties[consts.CUSTOM.TERRITORIAL_SEA] = seaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'exclusive economic zone:':
				map.datatypeProperties[consts.CUSTOM.EXCLUSIVE_ECONOMIC_ZONE] = seaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'contiguous zone:':
				map.datatypeProperties[consts.CUSTOM.CONTIGUOUS_ZONE] = seaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'exclusive fishing zone:':
				map.datatypeProperties[consts.CUSTOM.EXCLUSIVE_FISHING_ZONE] = seaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'continental shelf:':
				map.datatypeProperties[consts.CUSTOM.CONTINENTAL_SHELF] = seaData.replace(/,|[a-z]/g, '').trim();
				map.datatypeProperties[consts.CUSTOM.CONTINENTAL_SHELF_MODIFIER] = seaData.substring(seaData.indexOf('nm or') + 5).trim();
				break;
		}
	});
	map.datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'nm';
	cheerioElem('#field-maritime-claims > div.category_data.note').each(function() {
		map.datatypeProperties[consts.CUSTOM.SUPPLEMENTAL_EXPLANATION] = cheerioElem(this).text().replace(/\\n/g, ' ').trim();
	});
};