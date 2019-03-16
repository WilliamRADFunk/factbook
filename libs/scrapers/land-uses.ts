import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getLandUses(cheerioElem: CheerioSelector, country: string, countryId: string) {
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
	cheerioElem('#field-land-use div.category_data.subfield.numeric').each(function() {
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
                    const agLandRef = objectProp[consts.ONTOLOGY.HAS_AGRICULTURAL_LAND];
                    store.agriculturalLands[alId] = agLandRef;
                    store.landUses[luId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_AGRICULTURAL_LAND, objectProp));
                    agLandRef.datatypeProperties[consts.ONTOLOGY.PERCENTAGE] = landUse1Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                    agLandRef.datatypeProperties[consts.ONTOLOGY.LAST_ESTIMATED] = date1Data.substring(date1Data.indexOf('('), date1Data.indexOf(')') + 1).trim() || 'N/A';
                    break;
                case 'forest:':
                    const fId = consts.ONTOLOGY.INST_FOREST_LAND + getUuid(country);
                    objectProp = entityMaker(
                        consts.ONTOLOGY.HAS_FOREST_LAND,
                        consts.ONTOLOGY.ONT_FOREST_LAND,
                        fId,
                        `Forest Land Use for ${country}`);
                    const fLandRef = objectProp[consts.ONTOLOGY.HAS_FOREST_LAND];
                    store.forestLands[fId] = fLandRef;
                    store.landUses[luId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_FOREST_LAND, objectProp));
                    fLandRef.datatypeProperties[consts.ONTOLOGY.PERCENTAGE] = landUse1Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                    fLandRef.datatypeProperties[consts.ONTOLOGY.LAST_ESTIMATED] = date1Data.substring(date1Data.indexOf('('), date1Data.indexOf(')') + 1).trim() || 'N/A';
                    break;
                case 'other:':
                    const oId = consts.ONTOLOGY.INST_OTHER_LAND + getUuid(country);
                    objectProp = entityMaker(
                        consts.ONTOLOGY.HAS_OTHER_LAND,
                        consts.ONTOLOGY.ONT_OTHER_LAND,
                        oId,
                        `Other Land Use for ${country}`);
                    const oLandRef = objectProp[consts.ONTOLOGY.HAS_OTHER_LAND];
                    store.otherLands[oId] = oLandRef;
                    store.landUses[luId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_OTHER_LAND, objectProp));
                    oLandRef.datatypeProperties[consts.ONTOLOGY.PERCENTAGE] = landUse1Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                    oLandRef.datatypeProperties[consts.ONTOLOGY.LAST_ESTIMATED] = date1Data.substring(date1Data.indexOf('('), date1Data.indexOf(')') + 1).trim() || 'N/A';
                    break;
            }
        }
    });
	cheerioElem('#field-land-use div.category_data.subfield.grouped_subfield').each(function() {
        const landUse2Data = cheerioElem(this).text().trim();
        const groupSplit = landUse2Data.split('/').map(land => land.trim());
        const percentages = groupSplit.map(land => land.substring(0, land.indexOf('%')).replace(/[^0-9\-\.]/g, '').trim());
        const dates = groupSplit.map(land => land.substring(land.indexOf('('), land.indexOf(')') + 1).trim());
        if (percentages.length) {
            // Arable Land
            const arbId = consts.ONTOLOGY.INST_ARABLE_LAND + getUuid(country);
            const objectPropArable = entityMaker(
                consts.ONTOLOGY.HAS_ARABLE_LAND,
                consts.ONTOLOGY.ONT_ARABLE_LAND,
                arbId,
                `Arable Land Use for ${country}`);
            const arbLandRef = objectPropArable[consts.ONTOLOGY.HAS_ARABLE_LAND];
            store.arableLands[arbId] = arbLandRef;
            store.landUses[luId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_ARABLE_LAND, objectPropArable));
            arbLandRef.datatypeProperties[consts.ONTOLOGY.PERCENTAGE] = percentages[0] || null;
            arbLandRef.datatypeProperties[consts.ONTOLOGY.LAST_ESTIMATED] = dates[0] || 'N/A';
            // Permanent Crops Land
            const pcId = consts.ONTOLOGY.INST_PERMANENT_CROPS_LAND + getUuid(country);
            const objectPropPermCrop = entityMaker(
                consts.ONTOLOGY.HAS_PERMANENT_CROPS_LAND,
                consts.ONTOLOGY.ONT_PERMANENT_CROPS_LAND,
                pcId,
                `Permanent Crops Land Use for ${country}`);
            const pcLandRef = objectPropPermCrop[consts.ONTOLOGY.HAS_PERMANENT_CROPS_LAND];
            store.permanentCropsLands[pcId] = pcLandRef;
            store.landUses[luId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_PERMANENT_CROPS_LAND, objectPropPermCrop));
            pcLandRef.datatypeProperties[consts.ONTOLOGY.PERCENTAGE] = percentages[1] || null;
            pcLandRef.datatypeProperties[consts.ONTOLOGY.LAST_ESTIMATED] = dates[1] || 'N/A';
            // Permanent Pasture Land
            const ppId = consts.ONTOLOGY.INST_PERMANENT_PASTURE_LAND + getUuid(country);
            const objectPropPermPast = entityMaker(
                consts.ONTOLOGY.HAS_PERMANENT_PASTURE_LAND,
                consts.ONTOLOGY.ONT_PERMANENT_PASTURE_LAND,
                ppId,
                `Permanent Pasture Land Use for ${country}`);
            const ppLandRef = objectPropPermPast[consts.ONTOLOGY.HAS_PERMANENT_PASTURE_LAND];
            store.permanentPastureLands[ppId] = ppLandRef;
            store.landUses[luId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_PERMANENT_PASTURE_LAND, objectPropPermPast));
            ppLandRef.datatypeProperties[consts.ONTOLOGY.PERCENTAGE] = percentages[2] || null;
            ppLandRef.datatypeProperties[consts.ONTOLOGY.LAST_ESTIMATED] = dates[2] || 'N/A';
        }
    });
};