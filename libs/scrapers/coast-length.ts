import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getCoastLength(cheerioElem, country, countryId) {
    const objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.CUSTOM.HAS_COAST);
	const clId = consts.CUSTOM.INST_COAST + getUuid(country);
	let objectProp = {};
    let bailOut = true;
    cheerioElem('#field-coastline').each(function() {
		if (!map) {
			if (store.coasts[clId]) {
				objectProp[consts.CUSTOM.HAS_COAST] = store.coasts[clId];
			} else {
				objectProp = entityMaker(
					consts.CUSTOM.HAS_COAST,
					consts.CUSTOM.ONT_COAST,
					clId,
					`Coast of ${country}`);
				store.coasts[clId] = objectProp[consts.CUSTOM.HAS_COAST];
			}
			map = objectProp[consts.CUSTOM.HAS_COAST];
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_COAST, objectProp));
		}
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
	cheerioElem('#field-coastline').each(function() {
        const coastGrd = cheerioElem(this).find('div.category_data.subfield.numeric').text().trim()
        if (coastGrd) {
			const coastGrdSplit = coastGrd.split('km');
			map.datatypeProperties[consts.CUSTOM.ONT_LENGTH] = coastGrdSplit[0].trim();
			map.datatypeProperties[consts.CUSTOM.ONT_LENGTH_MODIFIER] = coastGrdSplit.slice(1).join('km').replace(/\\n/g, '').trim() || null;
        }
	});
	map.datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'km';
};