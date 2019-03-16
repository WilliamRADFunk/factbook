import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getMaritimeClaims(cheerioElem: CheerioSelector, country: string, countryId: string) {
	const objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.ONTOLOGY.HAS_MARITIME_CLAIM);
	const mcId = consts.ONTOLOGY.INST_MARITIME_CLAIM + getUuid(country);
	let objectProp = {};
    let bailOut = true;
    cheerioElem('#field-maritime-claims').each(function() {
		if (!map) {
			if (store.maritimeClaims[mcId]) {
				objectProp[consts.ONTOLOGY.HAS_MARITIME_CLAIM] = store.maritimeClaims[mcId];
			} else {
				objectProp = entityMaker(
					consts.ONTOLOGY.HAS_MARITIME_CLAIM,
					consts.ONTOLOGY.ONT_MARITIME_CLAIM,
					mcId,
					`Maritime Claim for ${country}`);
				store.maritimeClaims[mcId] = objectProp[consts.ONTOLOGY.HAS_MARITIME_CLAIM];
			}
			map = objectProp[consts.ONTOLOGY.HAS_MARITIME_CLAIM];
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_MARITIME_CLAIM, objectProp));
		}
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
	cheerioElem('#field-maritime-claims > div.category_data.subfield.numeric').each(function() {
		const seaSwitch = cheerioElem(this).find('span.subfield-name').text().trim();
		const seaData = cheerioElem(this).find('span.subfield-number').text().trim();
		switch (seaSwitch) {
			case 'territorial sea:':
				map.datatypeProperties[consts.ONTOLOGY.TERRITORIAL_SEA] = seaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'exclusive economic zone:':
				map.datatypeProperties[consts.ONTOLOGY.EXCLUSIVE_ECONOMIC_ZONE] = seaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'contiguous zone:':
				map.datatypeProperties[consts.ONTOLOGY.CONTIGUOUS_ZONE] = seaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'exclusive fishing zone:':
				map.datatypeProperties[consts.ONTOLOGY.EXCLUSIVE_FISHING_ZONE] = seaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'continental shelf:':
				map.datatypeProperties[consts.ONTOLOGY.CONTINENTAL_SHELF] = seaData.replace(/,|[a-z]/g, '').trim();
				map.datatypeProperties[consts.ONTOLOGY.CONTINENTAL_SHELF_MODIFIER] = seaData.substring(seaData.indexOf('nm or') + 5).trim();
				break;
		}
	});
	map.datatypeProperties[consts.ONTOLOGY.UNIT] = 'nm';
	cheerioElem('#field-maritime-claims > div.category_data.note').each(function() {
		map.datatypeProperties[consts.ONTOLOGY.SUPPLEMENTAL_EXPLANATION] = cheerioElem(this).text().replace(/\\n/g, ' ').trim();
	});
};