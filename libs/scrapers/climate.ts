import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getClimate(cheerioElem, country, countryId) {
    const objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.CUSTOM.HAS_CLIMATE);
	if (!map) {
		const cId = consts.CUSTOM.INST_CLIMATE + getUuid(country);
		let objectProp = {};
		if (store.climates[cId]) {
			objectProp[consts.CUSTOM.HAS_CLIMATE] = store.climates[cId];
		} else {
			objectProp = entityMaker(
				consts.CUSTOM.HAS_CLIMATE,
				consts.CUSTOM.ONT_CLIMATE,
				cId,
				`Climate for ${country}`);
			store.climates[cId] = objectProp[consts.CUSTOM.HAS_CLIMATE];
		}
		map = objectProp[consts.CUSTOM.HAS_CLIMATE];
		store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_CLIMATE, objectProp));
	}

	let mapZone = getRelation(map.objectProperties, consts.CUSTOM.HAS_CLIMATE_ZONE);
	let zone;
	if (!mapZone) {
		const czId = consts.CUSTOM.INST_CLIMATE_ZONE + getUuid(country);
		zone = {};
		if (store.climateZones[czId]) {
			zone[consts.CUSTOM.HAS_CLIMATE_ZONE] = store.climateZones[czId];
		} else {
			const attr = {};
			attr[consts.CUSTOM.CLIMATE_ZONE_NAME] = 'N/A';
			attr[consts.CUSTOM.CLIMATE_ZONE_DESCRIPTION] = 'N/A';

			zone = {};
			zone = entityMaker(
				consts.CUSTOM.HAS_CLIMATE_ZONE,
				consts.CUSTOM.ONT_CLIMATE_ZONE,
				czId,
				`Climate Zone for ${country}`);
			store.climateZones[czId] = zone[consts.CUSTOM.HAS_CLIMATE_ZONE];
		}
		mapZone = zone[consts.CUSTOM.HAS_CLIMATE_ZONE];
	}
	map.objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_CLIMATE_ZONE, zone));

	cheerioElem('#field-climate').each(function() {
        const climGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim()
        if (climGrd) {
			const tempSplit = climGrd.replace(/\\n/g, '').trim().split(';');
			mapZone.datatypeProperties[consts.CUSTOM.CLIMATE_ZONE_NAME] = tempSplit[0].trim();
			mapZone.datatypeProperties[consts.CUSTOM.CLIMATE_ZONE_DESCRIPTION] = tempSplit.slice(1).join(';').trim();
        }
	});
};