import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getLandUses(cheerioElem, country, countryId) {
    const objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.ONTOLOGY.HAS_LAND_USE);
	const luId = consts.ONTOLOGY.INST_LAND_USE + getUuid(country);
    let objectProp = {};
    let bailOut = true;
    cheerioElem('#field-land-use').each(function() {
        if (!map) {
            if (store.landUses[luId]) {
                objectProp[consts.ONTOLOGY.HAS_LAND_USE] = store.landUses[luId];
            } else {
                objectProp = entityMaker(
                    consts.ONTOLOGY.HAS_LAND_USE,
                    consts.ONTOLOGY.ONT_LAND_USE,
                    luId,
                    `Land Use for ${country}`);
                store.landUses[luId] = objectProp[consts.ONTOLOGY.HAS_LAND_USE];
            }
            map = objectProp[consts.ONTOLOGY.HAS_LAND_USE];
            store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_LAND_USE, objectProp));
        }
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
	cheerioElem('#field-land-use > div.category_data.subfield.numeric').each(function() {
		const landUse1Switch = cheerioElem(this).find('span.subfield-name').text().trim();
        const landUse1Data = cheerioElem(this).find('span.subfield-number').text().trim();
        const date1Data = cheerioElem(this).find('span.subfield-date').text().trim();
        const refinedValue1 = landUse1Data.replace(/[^0-9\-\.]/g, '').trim() || null;
        if (refinedValue1) {
            let objectProp = {};
            switch (landUse1Switch) {
                case 'agricultural land:':
                    const alId = consts.ONTOLOGY.INST_AGRICULTURAL_LAND + getUuid(country);
                    objectProp = entityMaker(
                        consts.ONTOLOGY.HAS_AGRICULTURAL_LAND,
                        consts.ONTOLOGY.ONT_AGRICULTURAL_LAND,
                        alId,
                        `Agricultural Land Use for ${country}`);
                    store.agriculturalLands[alId] = objectProp[consts.ONTOLOGY.HAS_AGRICULTURAL_LAND];
                    const agLandRef = objectProp[consts.ONTOLOGY.HAS_AGRICULTURAL_LAND];
                    store.landUses[luId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_AGRICULTURAL_LAND, objectProp));
                    // map.datatypeProperties[consts.ONTOLOGY.AGRICULTURAL_LAND] = landUse1Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                    break;
                case 'forest:':
                    map.datatypeProperties[consts.ONTOLOGY.FOREST_LAND] = landUse1Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                    break;
                case 'other:':
                    map.datatypeProperties[consts.ONTOLOGY.OTHER_LAND] = landUse1Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                    break;
            }
        }
    });
	cheerioElem('#field-land-use > div.category_data.subfield.grouped_subfield').each(function() {
		const landUse2Switch = cheerioElem(this).find('span.subfield-name').text().trim();
        const landUse2Data = cheerioElem(this).text().trim();
        const date2Data = cheerioElem(this).find('span.subfield-date').text().trim();
        const refinedValue2 = landUse2Data.replace(/[^0-9\-\.]/g, '').trim() || null;
        if (refinedValue2) {
            switch (landUse2Switch) {
                case 'arable land:':
                map.datatypeProperties[consts.ONTOLOGY.ARABLE_LAND] = landUse2Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                if (date2Data) {
                    map.datatypeProperties[consts.ONTOLOGY.LAST_ESTIMATED] = date2Data.trim() || null;
                }
                break;
            case 'permanent crops:':
                map.datatypeProperties[consts.ONTOLOGY.PERMANENT_CROPS_LAND] = landUse2Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                break;
            case 'permanent pasture:':
                map.datatypeProperties[consts.ONTOLOGY.PERMANENT_PASTURE_LAND] = landUse2Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                break;
            }
        }
    });
	map.datatypeProperties[consts.ONTOLOGY.UNIT] = '%';
};