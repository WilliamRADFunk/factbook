import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getClimate(cheerioElem: CheerioSelector, country: string, countryId: string) {
    const objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.ONTOLOGY.HAS_CLIMATE);
	let mapZone;
    let bailOut = true;
    cheerioElem('#field-climate').each(function() {
		if (!map) {
			const cId = consts.ONTOLOGY.INST_CLIMATE + getUuid(country);
			let objectProp = {};
			if (store.climates[cId]) {
				objectProp[consts.ONTOLOGY.HAS_CLIMATE] = store.climates[cId];
			} else {
				objectProp = entityMaker(
					consts.ONTOLOGY.HAS_CLIMATE,
					consts.ONTOLOGY.ONT_CLIMATE,
					cId,
					`Climate for ${country}`);
				store.climates[cId] = objectProp[consts.ONTOLOGY.HAS_CLIMATE];
			}
			map = objectProp[consts.ONTOLOGY.HAS_CLIMATE];
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_CLIMATE, objectProp));
		}

		mapZone = getRelation(map.objectProperties, consts.ONTOLOGY.HAS_CLIMATE_ZONE);
		let zone;
		if (!mapZone) {
			const czId = consts.ONTOLOGY.INST_CLIMATE_ZONE + getUuid(country);
			zone = {};
			if (store.climateZones[czId]) {
				zone[consts.ONTOLOGY.HAS_CLIMATE_ZONE] = store.climateZones[czId];
			} else {
				const attr = {};
				attr[consts.ONTOLOGY.CLIMATE_ZONE_NAME] = 'N/A';
				attr[consts.ONTOLOGY.CLIMATE_ZONE_DESCRIPTION] = 'N/A';

				zone = {};
				zone = entityMaker(
					consts.ONTOLOGY.HAS_CLIMATE_ZONE,
					consts.ONTOLOGY.ONT_CLIMATE_ZONE,
					czId,
					`Climate Zone for ${country}`);
				store.climateZones[czId] = zone[consts.ONTOLOGY.HAS_CLIMATE_ZONE];
			}
			mapZone = zone[consts.ONTOLOGY.HAS_CLIMATE_ZONE];
		}
		map.objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_CLIMATE_ZONE, zone));
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
	cheerioElem('#field-climate').each(function() {
        const climGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim()
        if (climGrd) {
			const tempSplit = climGrd.replace(/\\n/g, '').trim().split(';');
			mapZone.datatypeProperties[consts.ONTOLOGY.CLIMATE_ZONE_NAME] = tempSplit[0].trim();
			mapZone.datatypeProperties[consts.ONTOLOGY.CLIMATE_ZONE_DESCRIPTION] = tempSplit.slice(1).join(';').trim();
			mapZone[consts.RDFS.label] = `Climate Zone (${mapZone.datatypeProperties[consts.ONTOLOGY.CLIMATE_ZONE_NAME]})`
        }
	});
};